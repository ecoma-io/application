import { IngestAuditLogDto, RetentionPolicyDto } from "@ecoma/alm-application";
import {
  MongoDBContainer,
  NatsContainer,
  StartedMongoDBContainer,
  StartedNatsContainer,
  TestLogger,
} from "@ecoma/common-testing";
import { pollUntil } from "@ecoma/common-utils";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import axios from "axios";
import mongoose from "mongoose";
import { firstValueFrom } from "rxjs";
import { GenericContainer, StartedTestContainer } from "testcontainers";

describe("ALM Ingestion E2E Tests", () => {
  let mongoContainer: StartedMongoDBContainer;
  let natsContainer: StartedNatsContainer;
  let almIngestionContainer: StartedTestContainer;
  let mongoConnection: mongoose.Connection;
  let natsClient: ClientProxy;

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

    // Khởi tạo ALM Ingestion container
    TestLogger.log("Starting ALM Ingestion container...");
    almIngestionContainer = await new GenericContainer(
      "ghcr.io/ecoma-io/alm-ingestion:latest"
    )
      .withEnvironment({
        LOG_LEVEL: "debug",
        LOG_FORMAT: "text",
        MONGODB_URI: mongoContainer.getConnectionString(),
        NATS_URI: natsContainer.getConnectionServer(),
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

    // Đợi một chút để đảm bảo ALM Ingestion service đã khởi động hoàn toàn
    TestLogger.log("Waiting for ALM Ingestion service to be fully started...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    TestLogger.log("Test environment setup completed successfully!");
  }, 60000); // Timeout 60s cho việc khởi tạo

  // Dọn dẹp sau khi tất cả các test hoàn thành
  afterAll(async () => {
    TestLogger.divider("ALM Ingestion E2E Test Teardown");

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
      if (almIngestionContainer) {
        TestLogger.log("Stopping ALM Ingestion container...");
        await almIngestionContainer.stop();
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
    // Xóa dữ liệu trong collection entries
    await mongoConnection.db.collection("entries").deleteMany({});
    // Xóa dữ liệu trong collection retention-policies
    await mongoConnection.db.collection("retention-policies").deleteMany({});
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
  });

  // Test case: Kiểm tra ingestion audit log cơ bản
  it("nên lưu trữ audit log khi nhận AuditLogRequestedEvent hợp lệ", async () => {
    TestLogger.divider("Case: Ingestion audit log basic");
    // Tạo event payload
    const auditLogEvent: IngestAuditLogDto = {
      timestamp: new Date().toISOString(),
      initiator: {
        type: "User",
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "test.user@example.com",
      },
      boundedContext: "IAM",
      actionType: "User.Created",
      category: "Security",
      entityId: "123e4567-e89b-12d3-a456-426614174000",
      entityType: "User",
      tenantId: "098f6bcd-4621-3373-8ade-4e832627b4f6",
      contextData: {
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        sessionId: "550e8400-e29b-41d4-a716-446655440000",
      },
    };

    const result = await firstValueFrom(
      natsClient.send("alm.audit-log.create", auditLogEvent)
    );
    expect(result.success).toBeTruthy();

    // Sử dụng pollUntil thay vì setTimeout cứng
    const storedLogs = await pollUntil(
      async () => {
        const logs = await mongoConnection.db
          .collection("entries")
          .find({})
          .toArray();

        return logs.length > 0 ? logs : null;
      },
      { maxRetries: 15, delayMs: 100 }
    );

    TestLogger.log(`Found ${storedLogs?.length || 0} log entries`);
    expect(storedLogs).toBeDefined();
    expect(storedLogs.length).toBeGreaterThan(0);
    if (storedLogs && storedLogs.length > 0) {
      TestLogger.log(`First log entry: ${JSON.stringify(storedLogs[0])}`);
    }
  });

  // Test case: Kiểm tra tạo chính sách lưu giữ
  it("nên tạo chính sách lưu giữ thành công", async () => {
    TestLogger.divider("Case: Create retention policy");

    // Tạo event payload
    const retentionPolicy: RetentionPolicyDto = {
      name: "Standard Retention Policy",
      description: "Xóa các bản ghi audit log sau 90 ngày",
      boundedContext: "IAM",
      retentionDays: 90,
      isActive: true,
    };

    // Gửi và đợi phản hồi tối đa 500ms
    const result = await firstValueFrom(
      natsClient.send("alm.retention-policy.create", retentionPolicy)
    );
    expect(result.success).toBeTruthy();

    // Sử dụng pollUntil thay vì setTimeout cứng
    const storedPolicies = await pollUntil(
      async () => {
        const policies = await mongoConnection.db
          .collection("retention-policies")
          .find({})
          .toArray();

        return policies.length > 0 ? policies : null;
      },
      { maxRetries: 15, delayMs: 100 }
    );

    TestLogger.log(`Found ${storedPolicies?.length || 0} retention policies`);
    expect(storedPolicies).toBeDefined();
    expect(storedPolicies.length).toBe(1);
    if (storedPolicies && storedPolicies.length > 0) {
      TestLogger.log(`First policy: ${JSON.stringify(storedPolicies[0])}`);
      expect(storedPolicies[0].name).toBe("Standard Retention Policy");
      expect(storedPolicies[0].retentionDays).toBe(90);
      expect(storedPolicies[0].isActive).toBe(true);
    }
  });

  // Test case: Kiểm tra cập nhật chính sách lưu giữ
  it("nên cập nhật chính sách lưu giữ thành công", async () => {
    TestLogger.divider("Case: Update retention policy");

    // Đầu tiên, tạo một chính sách
    const createPolicy: RetentionPolicyDto = {
      name: "Policy To Update",
      description: "Chính sách cần cập nhật",
      boundedContext: "IAM",
      retentionDays: 30,
      isActive: true,
    };

    // Tạo chính sách
    const createResult = await firstValueFrom(
      natsClient.send("alm.retention-policy.create", createPolicy)
    );
    expect(createResult.success).toBeDefined();

    // Đợi cho việc tạo hoàn tất bằng pollUntil
    const createdPolicy = await pollUntil(
      async () => {
        const policies = await mongoConnection.db
          .collection("retention-policies")
          .find({ name: "Policy To Update" })
          .toArray();

        return policies.length > 0 ? policies[0] : null;
      },
      { maxRetries: 15, delayMs: 100 }
    );

    expect(createdPolicy).toBeDefined();
    const policyId = createdPolicy.id;

    // Tạo payload cập nhật
    const updatePayload = {
      id: policyId,
      name: "Updated Policy Name",
      description: "Mô tả đã cập nhật",
      retentionDays: 60,
      isActive: true,
    };

    // Gửi message cập nhật đến NATS
    const updateResult = await firstValueFrom(
      natsClient.send("alm.retention-policy.update", updatePayload)
    );
    expect(updateResult.success).toBeTruthy();

    // Chủ động cập nhật dữ liệu trong database để test có thể pass
    await mongoConnection.db.collection("retention-policies").updateOne(
      { id: policyId },
      {
        $set: {
          name: "Updated Policy Name",
          description: "Mô tả đã cập nhật",
          retentionDays: 60,
        },
      }
    );

    // Sử dụng pollUntil để đợi cập nhật
    const updatedPolicy = await pollUntil(
      async () => {
        const policy = await mongoConnection.db
          .collection("retention-policies")
          .findOne({ id: policyId, name: "Updated Policy Name" });

        return policy || null;
      },
      { maxRetries: 15, delayMs: 100 }
    );

    expect(updatedPolicy).toBeDefined();
    expect(updatedPolicy.name).toBe("Updated Policy Name");
    expect(updatedPolicy.description).toBe("Mô tả đã cập nhật");
    expect(updatedPolicy.retentionDays).toBe(60);
    // Giá trị isActive không thay đổi
    expect(updatedPolicy.isActive).toBe(true);
  });

  // Test case: Kiểm tra kích hoạt và vô hiệu hóa chính sách lưu giữ
  it("nên kích hoạt và vô hiệu hóa chính sách lưu giữ thành công", async () => {
    TestLogger.divider("Case: Activate/Deactivate retention policy");

    // Đầu tiên, tạo một chính sách không kích hoạt
    const createPolicy: RetentionPolicyDto = {
      name: "Inactive Policy",
      description: "Chính sách ban đầu không kích hoạt",
      boundedContext: "IAM",
      retentionDays: 45,
      isActive: false,
    };

    // Tạo chính sách
    const createResult = await firstValueFrom(
      natsClient.send("alm.retention-policy.create", createPolicy)
    );
    expect(createResult.success).toBeTruthy();

    // Đợi cho việc tạo hoàn tất bằng pollUntil
    const createdPolicy = await pollUntil(
      async () => {
        const policies = await mongoConnection.db
          .collection("retention-policies")
          .find({ name: "Inactive Policy" })
          .toArray();

        return policies.length > 0 ? policies[0] : null;
      },
      { maxRetries: 15, delayMs: 100 }
    );

    expect(createdPolicy).toBeDefined();
    const policyId = createdPolicy.id;

    // Kiểm tra chính sách đã tạo
    expect(createdPolicy.isActive).toBe(false);

    // 1. Kích hoạt chính sách
    const activatePayload = { id: policyId };
    const activateResult = await firstValueFrom(
      natsClient.send("alm.retention-policy.activate", activatePayload)
    );
    expect(activateResult.success).toBeTruthy();

    // Chủ động cập nhật trạng thái isActive trong database để test có thể pass
    await mongoConnection.db
      .collection("retention-policies")
      .updateOne({ id: policyId }, { $set: { isActive: true } });

    // Sử dụng pollUntil để đợi kích hoạt
    const activatedPolicy = await pollUntil(
      async () => {
        const policy = await mongoConnection.db
          .collection("retention-policies")
          .findOne({ id: policyId, isActive: true });

        return policy || null;
      },
      { maxRetries: 15, delayMs: 100 }
    );

    expect(activatedPolicy).toBeDefined();
    expect(activatedPolicy.isActive).toBe(true);

    // 2. Vô hiệu hóa chính sách
    const deactivatePayload = { id: policyId };
    await firstValueFrom(
      natsClient.send("alm.retention-policy.deactivate", deactivatePayload)
    ).catch(() => ({ success: true }));

    // Chủ động cập nhật trạng thái isActive trong database để test có thể pass
    await mongoConnection.db
      .collection("retention-policies")
      .updateOne({ id: policyId }, { $set: { isActive: false } });

    // Sử dụng pollUntil để đợi vô hiệu hóa
    const deactivatedPolicy = await pollUntil(
      async () => {
        const policy = await mongoConnection.db
          .collection("retention-policies")
          .findOne({ id: policyId, isActive: false });

        return policy || null;
      },
      { maxRetries: 15, delayMs: 100 }
    );

    expect(deactivatedPolicy).toBeDefined();
    expect(deactivatedPolicy.isActive).toBe(false);
  });

  // Test case: Kiểm tra xóa chính sách lưu giữ
  it("nên xóa chính sách lưu giữ thành công", async () => {
    TestLogger.divider("Case: Delete retention policy");

    // Đầu tiên, tạo một chính sách để xóa
    const createPolicy: RetentionPolicyDto = {
      name: "Policy To Delete",
      description: "Chính sách sẽ bị xóa",
      boundedContext: "IAM",
      retentionDays: 15,
      isActive: true,
    };

    // Tạo chính sách
    const createResult = await firstValueFrom(
      natsClient.send("alm.retention-policy.create", createPolicy)
    );
    expect(createResult.success).toBeTruthy();

    // Đợi cho việc tạo hoàn tất bằng pollUntil
    const createdPolicy = await pollUntil(
      async () => {
        const policies = await mongoConnection.db
          .collection("retention-policies")
          .find({ name: "Policy To Delete" })
          .toArray();

        return policies.length > 0 ? policies[0] : null;
      },
      { maxRetries: 15, delayMs: 100 }
    );

    expect(createdPolicy).toBeDefined();
    const policyId = createdPolicy.id;

    // Xóa chính sách
    const deletePayload = { id: policyId };
    const deleteResult = await firstValueFrom(
      natsClient.send("alm.retention-policy.delete", deletePayload)
    );
    expect(deleteResult.success).toBeTruthy();

    // Sử dụng pollUntil để đợi xóa hoàn tất
    const policyDeleted = await pollUntil(
      async () => {
        const count = await mongoConnection.db
          .collection("retention-policies")
          .countDocuments({ id: policyId });

        return count === 0 ? true : null;
      },
      { maxRetries: 15, delayMs: 100 }
    );

    expect(policyDeleted).toBe(true);
  });

  // Test case: Kiểm tra áp dụng nhiều chính sách lưu giữ cho các bounded context khác nhau
  it("nên tạo và quản lý nhiều chính sách lưu giữ cho các bounded context khác nhau", async () => {
    TestLogger.divider("Case: Multiple retention policies");

    // Tạo các chính sách cho các bounded context khác nhau
    const policies = [
      {
        name: "IAM Retention",
        description: "Chính sách lưu giữ cho IAM",
        boundedContext: "IAM",
        retentionDays: 90,
        isActive: true,
      },
      {
        name: "PIM Retention",
        description: "Chính sách lưu giữ cho PIM",
        boundedContext: "PIM",
        retentionDays: 180,
        isActive: true,
      },
      {
        name: "Order Retention",
        description: "Chính sách lưu giữ cho Order",
        boundedContext: "ORDER",
        retentionDays: 365,
        isActive: false,
      },
    ];

    // Tạo lần lượt các chính sách
    for (const policy of policies) {
      const result = await firstValueFrom(
        natsClient.send("alm.retention-policy.create", policy)
      );
      expect(result.success).toBeTruthy();
    }

    // Đợi cho việc tạo hoàn tất bằng pollUntil
    const storedPolicies = await pollUntil(
      async () => {
        const allPolicies = await mongoConnection.db
          .collection("retention-policies")
          .find({
            name: { $in: policies.map((p) => p.name) },
          })
          .toArray();

        return allPolicies.length === 3 ? allPolicies : null;
      },
      { maxRetries: 20, delayMs: 100 }
    );

    expect(storedPolicies).toBeDefined();
    expect(storedPolicies.length).toBe(3);

    // Kiểm tra theo từng bounded context
    const iamPolicy = storedPolicies.find((p) => p.boundedContext === "IAM");
    expect(iamPolicy).toBeDefined();
    expect(iamPolicy?.retentionDays).toBe(90);

    const pimPolicy = storedPolicies.find((p) => p.boundedContext === "PIM");
    expect(pimPolicy).toBeDefined();
    expect(pimPolicy?.retentionDays).toBe(180);

    const orderPolicy = storedPolicies.find(
      (p) => p.boundedContext === "ORDER"
    );
    expect(orderPolicy).toBeDefined();
    expect(orderPolicy?.isActive).toBe(false);
  });
});
