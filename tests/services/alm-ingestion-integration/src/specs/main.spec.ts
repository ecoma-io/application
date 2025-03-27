import {
  MongoDBContainer,
  NatsContainer,
  RabbitMQContainer,
  StartedMongoDBContainer,
  StartedNatsContainer,
  StartedRabbitMQContainer,
  TestLogger,
} from "@ecoma/common-testing";
import * as amqp from "amqplib";
import axios from "axios";
import mongoose from "mongoose";
import { GenericContainer, StartedTestContainer } from "testcontainers";

describe("ALM Ingestion E2E Tests", () => {
  let mongoContainer: StartedMongoDBContainer;
  let natsContainer: StartedNatsContainer;
  let rabbitmqContainer: StartedRabbitMQContainer;
  let almIngestionContainer: StartedTestContainer;
  let mongoConnection: mongoose.Connection;
  let rabbitMQConnection: any; // Sử dụng any để tránh lỗi type với amqplib
  let rabbitMQChannel: any; // Sử dụng any để tránh lỗi type với amqplib
  const exchangeName = "alm.events";
  const exchangeType = "topic";

  // Thiết lập môi trường test trước tất cả các test case
  beforeAll(async () => {
    TestLogger.divider("ALM Ingestion E2E Test Setup");
    TestLogger.log(
      "Setting up test environment for ALM Ingestion E2E tests..."
    );

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
    rabbitmqContainer = await new RabbitMQContainer().start();
    TestLogger.log(
      `RabbitMQ container started at ${rabbitmqContainer.getAmqpUrl()}`
    );

    // Khởi tạo ALM Ingestion container
    TestLogger.log("Starting ALM Ingestion container...");
    almIngestionContainer = await new GenericContainer(
      "ghcr.io/ecoma-io/alm-ingestion:latest"
    )
      .withEnvironment({
        LOG_LEVEL: "trace",
        LOG_FORMAT: "text",
        MONGODB_URI: mongoContainer.getConnectionString(),
        NATS_URL: natsContainer.getConnectionServer(),
        RABBITMQ_URI: rabbitmqContainer.getAmqpUrl(),
        ALM_RABBITMQ_EXCHANGE_NAME: exchangeName,
        ALM_RABBITMQ_EXCHANGE_TYPE: exchangeType,
        PORT: "3000",
        NODE_ENV: "test",
        DEBUG: "true", // Thêm biến môi trường DEBUG để xem thêm thông tin gỡ lỗi
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

    TestLogger.log("Started ALM Ingestion container successfully");

    // Cấu hình axios để trỏ đến ALM Ingestion service
    const host = almIngestionContainer.getHost();
    const port = almIngestionContainer.getMappedPort(3000);
    axios.defaults.baseURL = `http://${host}:${port}`;
    TestLogger.log(
      `ALM Ingestion container accessible at http://${host}:${port}`
    );

    // Kết nối đến MongoDB
    TestLogger.log("Connecting to MongoDB...");
    mongoConnection = await mongoose
      .createConnection(mongoContainer.getConnectionString(), {
        dbName: "audit-logs",
      })
      .asPromise();
    TestLogger.log("Connected to MongoDB successfully");

    // Kết nối đến RabbitMQ
    TestLogger.log("Connecting to RabbitMQ...");
    rabbitMQConnection = await amqp.connect(rabbitmqContainer.getAmqpUrl());
    rabbitMQChannel = await rabbitMQConnection.createChannel();
    await rabbitMQChannel.assertExchange(exchangeName, exchangeType, {
      durable: true,
    });
    TestLogger.log("Connected to RabbitMQ successfully");

    // Đợi một chút để đảm bảo ALM Ingestion service đã khởi động hoàn toàn
    TestLogger.log("Waiting for ALM Ingestion service to be fully started...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    TestLogger.log("Test environment setup completed successfully!");
  }, 60000); // Timeout 60s cho việc khởi tạo

  // Dọn dẹp sau khi tất cả các test hoàn thành
  afterAll(async () => {
    TestLogger.divider("ALM Ingestion E2E Test Teardown");

    try {
      // Đóng kết nối RabbitMQ
      if (rabbitMQChannel) {
        TestLogger.log("Closing RabbitMQ channel...");
        await rabbitMQChannel.close();
      }

      if (rabbitMQConnection) {
        TestLogger.log("Closing RabbitMQ connection...");
        await rabbitMQConnection.close();
      }

      // Đóng kết nối MongoDB
      if (mongoConnection) {
        TestLogger.log("Closing MongoDB connection...");
        await mongoConnection.close();
      }

      // Dừng các containers theo thứ tự ngược lại
      if (almIngestionContainer) {
        TestLogger.log("Stopping ALM Ingestion container...");
        await almIngestionContainer.stop();
      }

      if (rabbitmqContainer) {
        TestLogger.log("Stopping RabbitMQ container...");
        await rabbitmqContainer.stop();
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

  // Test case: Kiểm tra health endpoint
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

  // Test case: Kiểm tra ingestion audit log cơ bản
  it("nên lưu trữ audit log khi nhận AuditLogRequestedEvent hợp lệ", async () => {
    TestLogger.divider("Case: Ingestion audit log basic");
    // Tạo event payload
    const auditLogEvent = {
      timestamp: new Date().toISOString(),
      initiator: {
        type: "User",
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "test.user@example.com",
      },
      boundedContext: "IAM",
      actionType: "User.Created",
      category: "Security",
      severity: "High",
      entityId: "123e4567-e89b-12d3-a456-426614174000",
      entityType: "User",
      tenantId: "098f6bcd-4621-3373-8ade-4e832627b4f6",
      contextData: {
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        sessionId: "sess_123",
      },
      status: "Success",
      eventId: "550e8400-e29b-41d4-a716-446655440001",
    };

    // Publish event to RabbitMQ
    const routingKey = "alm.audit.log.requested";
    await rabbitMQChannel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(auditLogEvent))
    );

    // Wait for processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify audit log was stored
    const storedLogs = await mongoConnection.db
      .collection("audit_log_entries")
      .find({})
      .toArray();

    expect(storedLogs).toHaveLength(1);
    expect(storedLogs[0]).toMatchObject({
      timestamp: expect.any(Date),
      initiator: auditLogEvent.initiator,
      boundedContext: auditLogEvent.boundedContext,
      actionType: auditLogEvent.actionType,
      category: auditLogEvent.category,
      severity: auditLogEvent.severity,
      entityId: auditLogEvent.entityId,
      entityType: auditLogEvent.entityType,
      tenantId: auditLogEvent.tenantId,
      contextData: auditLogEvent.contextData,
      status: auditLogEvent.status,
      eventId: auditLogEvent.eventId,
      createdAt: expect.any(Date),
    });
  });

  // Test case: Kiểm tra xử lý audit log thất bại
  it("nên lưu trữ audit log với trạng thái thất bại", async () => {
    TestLogger.divider("Case: Ingestion audit log failed");
    const failedLoginEvent = {
      timestamp: new Date().toISOString(),
      initiator: {
        type: "User",
        id: null, // Unknown user
        name: "unknown@example.com",
      },
      boundedContext: "IAM",
      actionType: "User.Login",
      category: "Security",
      severity: "High",
      status: "Failure",
      failureReason: "Invalid credentials",
      contextData: {
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        attemptCount: 3,
      },
    };

    const routingKey = "alm.audit.log.requested";
    await rabbitMQChannel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(failedLoginEvent))
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const storedLogs = await mongoConnection.db
      .collection("audit_log_entries")
      .find({ status: "Failure" })
      .toArray();

    expect(storedLogs).toHaveLength(1);
    expect(storedLogs[0]).toMatchObject({
      status: "Failure",
      failureReason: "Invalid credentials",
      actionType: "User.Login",
    });
  });

  // Test case: Kiểm tra xử lý audit log từ nhiều Bounded Context
  it("nên xử lý audit logs từ các Bounded Context khác nhau", async () => {
    TestLogger.divider(
      "Case: Ingestion audit log from multiple Bounded Contexts"
    );
    const events = [
      {
        timestamp: new Date().toISOString(),
        initiator: {
          type: "User",
          id: "user1",
          name: "user1@example.com",
        },
        boundedContext: "PIM",
        actionType: "Product.Created",
        category: "Business",
        entityType: "Product",
        entityId: "prod1",
        status: "Success",
      },
      {
        timestamp: new Date().toISOString(),
        initiator: {
          type: "System",
          id: "scheduler1",
          name: "Notification Scheduler",
        },
        boundedContext: "NDM",
        actionType: "Notification.Sent",
        category: "Operational",
        status: "Success",
      },
    ];

    const routingKey = "alm.audit.log.requested";
    for (const event of events) {
      await rabbitMQChannel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(event))
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const storedLogs = await mongoConnection.db
      .collection("audit_log_entries")
      .find({})
      .toArray();

    expect(storedLogs).toHaveLength(2);
    expect(storedLogs.map((log) => log.boundedContext)).toContain("PIM");
    expect(storedLogs.map((log) => log.boundedContext)).toContain("NDM");
  });

  // Test case: Kiểm tra xử lý audit log với dữ liệu ngữ cảnh phức tạp
  it("nên xử lý audit log với contextData phức tạp", async () => {
    TestLogger.divider("Case: Ingestion audit log with complex contextData");
    const complexEvent = {
      timestamp: new Date().toISOString(),
      initiator: {
        type: "User",
        id: "admin1",
        name: "admin@example.com",
      },
      boundedContext: "BUM",
      actionType: "Subscription.Updated",
      category: "Business",
      severity: "Medium",
      entityId: "sub1",
      entityType: "Subscription",
      contextData: {
        changedFields: {
          plan: {
            oldValue: "Basic",
            newValue: "Premium",
          },
          price: {
            oldValue: 100,
            newValue: 200,
          },
          features: {
            oldValue: ["feature1", "feature2"],
            newValue: ["feature1", "feature2", "feature3"],
          },
        },
        metadata: {
          reason: "Upgrade request",
          approvedBy: "supervisor1",
        },
      },
      status: "Success",
    };

    const routingKey = "alm.audit.log.requested";
    await rabbitMQChannel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(complexEvent))
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const storedLogs = await mongoConnection.db
      .collection("audit_log_entries")
      .find({})
      .toArray();

    expect(storedLogs).toHaveLength(1);
    expect(storedLogs[0].contextData).toMatchObject(complexEvent.contextData);
  });

  // Test case: Kiểm tra xử lý audit log với initiator là hệ thống
  it("nên xử lý audit log từ system initiator", async () => {
    TestLogger.divider("Case: Ingestion audit log from system initiator");
    const systemEvent = {
      timestamp: new Date().toISOString(),
      initiator: {
        type: "System",
        id: "retention-worker",
        name: "ALM Retention Worker",
      },
      boundedContext: "ALM",
      actionType: "RetentionPolicy.Applied",
      category: "Operational",
      severity: "Low",
      contextData: {
        policiesApplied: 2,
        logsDeleted: 100,
        executionTime: "5s",
      },
      status: "Success",
    };

    const routingKey = "alm.audit.log.requested";
    await rabbitMQChannel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(systemEvent))
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const query = { "initiator.type": "System" } as const;
    const storedLogs = await mongoConnection.db
      .collection("audit_log_entries")
      .find(query)
      .toArray();

    expect(storedLogs).toHaveLength(1);
    expect(storedLogs[0].initiator.name).toBe("ALM Retention Worker");
  });

  // Test case: Kiểm tra xử lý audit log với dữ liệu không hợp lệ
  it("nên xử lý gracefully khi nhận event không hợp lệ", async () => {
    TestLogger.divider("Case: Ingestion audit log with invalid event");
    const invalidEvents = [
      {}, // Empty event
      { timestamp: "invalid-date" }, // Invalid timestamp
      null, // Null event
      { timestamp: new Date().toISOString() }, // Missing required fields
    ];

    const routingKey = "alm.audit.log.requested";
    for (const event of invalidEvents) {
      await rabbitMQChannel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(event))
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const storedLogs = await mongoConnection.db
      .collection("audit_log_entries")
      .find({})
      .toArray();

    // No valid logs should be stored
    expect(storedLogs).toHaveLength(0);
  });
});
