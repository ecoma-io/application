/**
 * @fileoverview E2E tests cho ALM Query Service
 */

import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import axios from "axios";
import mongoose from "mongoose";
import { firstValueFrom } from "rxjs";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { v4 as uuidv4 } from "uuid";

import {
  MongoDBContainer,
  NatsContainer,
  StartedMongoDBContainer,
  StartedNatsContainer,
  TestLogger,
} from "@ecoma/common-testing";

describe("ALM Query Service E2E Tests", () => {
  let mongoContainer: StartedMongoDBContainer;
  let natsContainer: StartedNatsContainer;
  let almQueryContainer: StartedTestContainer;
  let mongoConnection: mongoose.Connection;
  let natsClient: ClientProxy;
  const testTenantId = uuidv4();
  const testBusinessContextId = uuidv4();
  let createdPolicyId: string;

  // Thiết lập môi trường test trước tất cả các test case
  beforeAll(async () => {
    TestLogger.log("ALM Query E2E Test Setup");
    TestLogger.log("Setting up test environment for ALM Query E2E tests...");

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

    // Khởi tạo ALM Query container
    TestLogger.log("Starting ALM Query container...");

    // Sử dụng Docker image trực tiếp
    almQueryContainer = await new GenericContainer(
      "ghcr.io/ecoma-io/alm-query:latest"
    )
      .withEnvironment({
        LOG_LEVEL: "trace",
        LOG_FORMAT: "text",
        MONGODB_URI: mongoContainer.getConnectionString(),
        NATS_URL: "nats://" + natsContainer.getConnectionServer(),
        PORT: "3000",
        NODE_ENV: "test",
        DEBUG: "true", // Thêm biến môi trường DEBUG để xem thêm thông tin gỡ lỗi
        AUTH_BYPASS: "true", // Thêm biến môi trường để bypass AuthService
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

    TestLogger.log("Started ALM Query container successfully");

    // Cấu hình axios để trỏ đến ALM Query service
    const host = almQueryContainer.getHost();
    const port = almQueryContainer.getMappedPort(3000);
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

    // Đợi một chút để đảm bảo ALM Query service đã khởi động hoàn toàn
    TestLogger.log("Waiting for ALM Query service to be fully started...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    TestLogger.log("Test environment setup completed successfully!");
  }, 60000); // Timeout 60s cho việc khởi tạo

  // Dọn dẹp sau khi tất cả các test hoàn thành
  afterAll(async () => {
    TestLogger.log("ALM Query E2E Test Teardown");

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
      if (almQueryContainer) {
        TestLogger.log("Stopping ALM Query container...");
        await almQueryContainer.stop();
      }

      if (natsContainer) {
        TestLogger.log("Stopping NATS container...");
        await natsContainer.stop();
      }

      if (mongoContainer) {
        TestLogger.log("Stopping MongoDB container...");
        await mongoContainer.stop();
      }
      TestLogger.log("Test environment teardown completed successfully!");
    } catch (error) {
      TestLogger.error("Error during test teardown:", error);
      throw error;
    }
  }, 30000); // Timeout 30s cho việc dọn dẹp

  // Xóa tất cả dữ liệu audit log trước mỗi test
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

  describe("Retention Policy Management", () => {
    it("nên lấy được danh sách retention policies có phân trang", async () => {
      TestLogger.log("Testing paginated retention policies query...");
      const result = await firstValueFrom(
        natsClient.send("alm.retention-policy.find", {
          tenantId: testTenantId,
          data: {
            page: 1,
            limit: 10,
            businessContextId: testBusinessContextId,
          },
        })
      );

      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("total");
      expect(result.items.length).toBeGreaterThan(0);
      TestLogger.log(`Found ${result.items.length} retention policies`);
    });

    it("nên lấy được chi tiết một retention policy", async () => {
      TestLogger.log(`Testing get retention policy by ID: ${createdPolicyId}`);
      const result = await firstValueFrom(
        natsClient.send("alm.retention-policy.findOne", {
          tenantId: testTenantId,
          data: { id: createdPolicyId },
        })
      );

      expect(result.id).toBe(createdPolicyId);
      expect(result.name).toBe("Test Policy");
    });
  });
});
