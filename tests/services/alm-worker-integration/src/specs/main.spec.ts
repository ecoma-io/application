/**
 * @fileoverview E2E tests cho ALM Worker Service
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
  let almWorkerContainer: StartedTestContainer;
  let mongoConnection: mongoose.Connection;
  let natsClient: ClientProxy;

  // Thiết lập môi trường test trước tất cả các test case
  beforeAll(async () => {
    TestLogger.divider("ALM Worker E2E Test Setup");
    TestLogger.log("Setting up test environment for ALM Worker E2E tests...");

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

    // Khởi tạo ALM Worker container
    TestLogger.log("Starting ALM Worker container...");

    // Sử dụng Docker image trực tiếp
    almWorkerContainer = await new GenericContainer(
      "ghcr.io/ecoma-io/alm-worker:latest"
    )
      .withEnvironment({
        NODE_ENV: "test",
        PORT: "3000",
        LOG_LEVEL: "debug",
        LOG_FORMAT: "text",
        MONGODB_URI: mongoContainer.getConnectionString(),
        RABBITMQ_URI: rabbitMQContainer.getAmqpUrl(),
        NATS_URI: `nats://${natsContainer.getConnectionServer()}`,
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

    TestLogger.log("Started ALM Worker container successfully");

    // Cấu hình axios để trỏ đến ALM Worker service
    const host = almWorkerContainer.getHost();
    const port = almWorkerContainer.getMappedPort(3000);
    axios.defaults.baseURL = `http://${host}:${port}`;
    TestLogger.log(`ALM Worker container accessible at http://${host}:${port}`);

    // Kết nối đến MongoDB
    TestLogger.log("Connecting to MongoDB...");
    mongoConnection = await mongoose
      .createConnection(mongoContainer.getConnectionString(), {
        dbName: "audit-logs",
      })
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

    // Đợi một chút để đảm bảo ALM Worker service đã khởi động hoàn toàn
    TestLogger.log("Waiting for ALM Worker service to be fully started...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    TestLogger.log("Test environment setup completed successfully!");
  }, 60000); // Timeout 60s cho việc khởi tạo

  // Dọn dẹp sau khi tất cả các test hoàn thành
  afterAll(async () => {
    TestLogger.divider("ALM Worker E2E Test Teardown");

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
      if (almWorkerContainer) {
        TestLogger.log("Stopping ALM Worker container...");
        await almWorkerContainer.stop();
      }

      if (natsContainer) {
        TestLogger.log("Stopping NATS container...");
        await natsContainer.stop();
      }

      if (rabbitMQContainer) {
        TestLogger.log("Stopping RabbitMQ container...");
        await rabbitMQContainer.stop();
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

  // Hàm trợ giúp để chuẩn bị dữ liệu kiểm tra
  async function prepareTestData() {
    // Xóa dữ liệu cũ
    await mongoConnection.db.collection("entries").deleteMany({});
    await mongoConnection.db.collection("retention-policies").deleteMany({});

    // Tạo dữ liệu kiểm tra: audit logs
    const auditLogs = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        timestamp: new Date("2023-05-01T10:00:00Z"),
        initiator: {
          type: "User",
          id: "550e8400-e29b-41d4-a716-446655440111",
          name: "admin@example.com",
        },
        boundedContext: "IAM",
        actionType: "User.Created",
        category: "Security",
        entityId: "550e8400-e29b-41d4-a716-446655440222",
        entityType: "User",
        tenantId: "550e8400-e29b-41d4-a716-446655440333",
        contextData: {
          ipAddress: "192.168.1.1",
        },
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        timestamp: new Date("2023-05-02T11:00:00Z"),
        initiator: {
          type: "User",
          id: "550e8400-e29b-41d4-a716-446655440111",
          name: "admin@example.com",
        },
        boundedContext: "IAM",
        actionType: "User.Updated",
        category: "Security",
        entityId: "550e8400-e29b-41d4-a716-446655440222",
        entityType: "User",
        tenantId: "550e8400-e29b-41d4-a716-446655440333",
        contextData: {
          ipAddress: "192.168.1.1",
        },
      },
    ];

    // Tạo dữ liệu kiểm tra: retention policies
    const retentionPolicies = [
      {
        id: "550e8400-e29b-41d4-a716-446655440101",
        name: "IAM Retention",
        description: "Chính sách lưu giữ cho IAM",
        boundedContext: "IAM",
        retentionDays: 1, // Đặt 1 ngày để dễ test
        isActive: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
      },
    ];

    // Lưu vào DB
    await mongoConnection.db.collection("entries").insertMany(auditLogs);
    await mongoConnection.db
      .collection("retention-policies")
      .insertMany(retentionPolicies);

    return { auditLogs, retentionPolicies };
  }

  // Xóa tất cả dữ liệu audit log và retention policy trước mỗi test
  beforeEach(async () => {
    // Xóa dữ liệu trong collections
    await mongoConnection.db.collection("entries").deleteMany({});
    await mongoConnection.db.collection("retention-policies").deleteMany({});
  });

  it("nên trả về trạng thái health OK", async () => {
    TestLogger.divider("Case: Health endpoint");
    const response = await axios.get("/api/v1/health");
    expect(response.status).toBe(200);
    expect(response.data.status).toBe("ok");
    expect(response.data.details).toBeDefined();
    expect(response.data.details.mongodb).toBeDefined();
    expect(response.data.details.mongodb.status).toBe("up");
    expect(response.data.details.nats).toBeDefined();
    expect(response.data.details.nats.status).toBe("up");
    expect(response.data.details.rabbitmq).toBeDefined();
    expect(response.data.details.rabbitmq.status).toBe("up");
  });

  describe("Manual Retention", () => {
    it("nên xử lý được manual retention trigger", async () => {
      TestLogger.divider("Case: Manual retention trigger");

      // Chuẩn bị dữ liệu kiểm tra
      const { auditLogs, retentionPolicies } = await prepareTestData();

      // Gửi manual trigger qua NATS
      const triggerPayload = {
        batchSize: 10,
        policyIds: [retentionPolicies[0].id],
      };

      const result = await natsClient
        .send("alm.retention.manual.trigger", triggerPayload)
        .toPromise();

      // Kiểm tra kết quả
      expect(result).toBeDefined();
      expect(result.processedPolicies).toBe(1);
      expect(result.totalEntriesQueued).toBeGreaterThan(0);

      // Đợi một chút để cho worker xử lý
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Kiểm tra xem audit logs đã bị xóa chưa
      const remainingLogs = await mongoConnection.db
        .collection("entries")
        .find({})
        .toArray();

      expect(remainingLogs.length).toBe(0); // Tất cả logs đã bị xóa do quá hạn
    });
  });
});
