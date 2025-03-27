/**
 * @fileoverview E2E tests cho ALM Cleaner Service
 */

import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import axios from "axios";
import mongoose from "mongoose";
import { GenericContainer, StartedTestContainer } from "testcontainers";

import {
  MongoDBContainer,
  NatsContainer,
  RabbitMQContainer,
  StartedMongoDBContainer,
  StartedNatsContainer,
  StartedRabbitMQContainer,
  TestLogger,
} from "@ecoma/common-testing";

describe("ALM Worker Service E2E Tests", () => {
  let mongoContainer: StartedMongoDBContainer;
  let natsContainer: StartedNatsContainer;
  let rabbitMQContainer: StartedRabbitMQContainer;
  let almCleanerContainer: StartedTestContainer;
  let mongoConnection: mongoose.Connection;
  let natsClient: ClientProxy;

  // Thiết lập môi trường test trước tất cả các test case
  beforeAll(async () => {
    TestLogger.log("ALM Cleaner E2E Test Setup");
    TestLogger.log("Setting up test environment for ALM Cleaner E2E tests...");

    // Khởi tạo MongoDB container
    TestLogger.log("Starting MongoDB container...");
    mongoContainer = await new MongoDBContainer().start();
    TestLogger.log(
      `MongoDB container started at ${mongoContainer.getConnectionString()}`
    );

    // Khởi tạo NATS container
    TestLogger.log("Starting NATS container...");
    natsContainer = await new NatsContainer().start();
    TestLogger.log(
      `NATS container started at ${natsContainer.getConnectionServer()}`
    );

    // Khởi tạo RabbitMQ container
    TestLogger.log("Starting RabbitMQ container...");
    rabbitMQContainer = await new RabbitMQContainer().start();
    TestLogger.log(
      `RabbitMQ container started at ${rabbitMQContainer.getAmqpUrl()}`
    );

    // Khởi tạo ALM Cleaner container
    TestLogger.log("Starting ALM Cleaner container...");

    // Sử dụng Docker image trực tiếp
    almCleanerContainer = await new GenericContainer(
      "ghcr.io/ecoma-io/alm-worker:latest"
    )
      .withEnvironment({
        LOG_LEVEL: "trace",

        LOG_FORMAT: "text",

        MONGODB_URI: mongoContainer.getConnectionString(),

        NATS_URL: "nats://" + natsContainer.getConnectionServer(),

        RABBITMQ_URI: rabbitMQContainer.getAmqpUrl(),

        PORT: "3000",

        NODE_ENV: "test",

        DEBUG: "true", // Thêm biến môi trường DEBUG để xem thêm thông tin gỡ lỗi

        AUTH_BYPASS: "true", // Thêm biến môi trường để bypass AuthService

        RETENTION_DAYS: "7", // Giữ logs 7 ngày cho mục đích testing
      })
      .withExposedPorts(3000)
      .withLogConsumer((stream) => {
        stream.on("data", (line: string) => {
          TestLogger.log(line);
        });
        stream.on("error", (error: Error) => {
          TestLogger.error("Error consuming logs:", error);
        });
      })
      .start();

    TestLogger.log("Started ALM Cleaner container successfully");

    // Cấu hình axios để trỏ đến ALM Cleaner service
    const host = almCleanerContainer.getHost();
    const port = almCleanerContainer.getMappedPort(3000);
    axios.defaults.baseURL = `http://${host}:${port}`;
    TestLogger.log(
      `ALM Ingestion container accessible at http://${host}:${port}`
    );

    // Kết nối đến MongoDB
    TestLogger.log("Connecting to MongoDB...");
    mongoConnection = await mongoose
      .createConnection(mongoContainer.getConnectionString())
      .asPromise();

    TestLogger.log("Connected to MongoDB successfully");

    // Tạo module test với NATS client
    TestLogger.log("Creating NATS client...");
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: "NATS_CLIENT",
            transport: Transport.NATS,
            options: {
              servers: [`nats://${natsContainer.getConnectionServer()}`],
              timeout: 10000,
            },
          },
        ]),
      ],
    }).compile();

    // Lấy NATS client đã được đăng ký
    natsClient = moduleFixture.get<ClientProxy>("NATS_CLIENT");
    await natsClient.connect();
    TestLogger.log("Connected to NATS successfully");

    // Đợi một chút để đảm bảo ALM Cleaner service đã khởi động hoàn toàn
    TestLogger.log("Waiting for ALM Cleaner service to be fully started...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    TestLogger.log("Test environment setup completed successfully!");

    // Thêm vào cuối function để đăng ký mock handler
  }, 60000); // Timeout 60s cho việc khởi tạo

  // Dọn dẹp sau khi tất cả các test hoàn thành
  afterAll(async () => {
    TestLogger.log("ALM Cleaner E2E Test Teardown");

    try {
      // Đóng kết nối NATS client
      if (natsClient) {
        TestLogger.log("Closing NATS client...");
        await natsClient.close();
      }

      // Đóng kết nối MongoDB
      if (mongoConnection) {
        TestLogger.log("Closing MongoDB connection...");
        await mongoConnection.close();
      }

      // Dừng các containers theo thứ tự ngược lại
      if (almCleanerContainer) {
        TestLogger.log("Stopping ALM Cleaner container...");
        await almCleanerContainer.stop();
      }

      if (natsContainer) {
        TestLogger.log("Stopping NATS container...");
        await natsContainer.stop();
      }

      if (mongoContainer) {
        TestLogger.log("Stopping MongoDB container...");
        await mongoContainer.stop();
      }

      if (rabbitMQContainer) {
        TestLogger.log("Stopping RabbitMQ container...");
        await rabbitMQContainer.stop();
      }

      TestLogger.log("Test environment teardown completed successfully!");
    } catch (error) {
      TestLogger.error("Error during teardown:", error);
      throw error;
    }
  }, 30000); // Timeout 30s cho việc dọn dẹp

  // Xóa tất cả dữ liệu audit log và retention policy trước mỗi test
  beforeEach(async () => {
    // Xóa dữ liệu trong collection audit_log_entries
    await mongoConnection.db.collection("audit_log_entries").deleteMany({});
  });

  it("nên trả về trạng thái health OK", async () => {
    const response = await axios.get("/api/v1/health");
    expect(response.status).toBe(200);
    expect(response.data.status).toBe("ok");
    expect(response.data.details).toBeDefined();
    expect(response.data.details.mongodb).toBeDefined();
    expect(response.data.details.mongodb.status).toBe("up");
    expect(response.data.details.nats).toBeDefined();
    expect(response.data.details.nats.status).toBe("up");
  });
});
