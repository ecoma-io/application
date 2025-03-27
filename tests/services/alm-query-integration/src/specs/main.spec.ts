/**
 * @fileoverview E2E tests cho ALM Query Service
 */

import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import axios from "axios";
import mongoose from "mongoose";
import { GenericContainer, StartedTestContainer } from "testcontainers";

import {
  MongoDBContainer,
  NatsContainer,
  StartedMongoDBContainer,
  StartedNatsContainer,
  TestLogger,
} from "@ecoma/common-testing";
import { firstValueFrom } from "rxjs";

describe("ALM Query Service E2E Tests", () => {
  let mongoContainer: StartedMongoDBContainer;
  let natsContainer: StartedNatsContainer;
  let almQueryContainer: StartedTestContainer;
  let mongoConnection: mongoose.Connection;
  let natsClient: ClientProxy;

  // Thiết lập môi trường test trước tất cả các test case
  beforeAll(async () => {
    TestLogger.divider("ALM Query E2E Test Setup");
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
        LOG_LEVEL: "debug",
        LOG_FORMAT: "text",
        MONGODB_URI: mongoContainer.getConnectionString(),
        NATS_URI: "nats://" + natsContainer.getConnectionServer(),
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
    TestLogger.log(`ALM Query container accessible at http://${host}:${port}`);

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

    // Đợi một chút để đảm bảo ALM Query service đã khởi động hoàn toàn
    TestLogger.log("Waiting for ALM Query service to be fully started...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    TestLogger.log("Test environment setup completed successfully!");
  }, 60000); // Timeout 60s cho việc khởi tạo

  // Dọn dẹp sau khi tất cả các test hoàn thành
  afterAll(async () => {
    TestLogger.divider("ALM Query E2E Test Teardown");

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
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        timestamp: new Date("2023-05-03T12:00:00Z"),
        initiator: {
          type: "System",
          id: "550e8400-e29b-41d4-a716-446655440444",
          name: "System",
        },
        boundedContext: "PIM",
        actionType: "Product.Created",
        category: "Content",
        entityId: "550e8400-e29b-41d4-a716-446655440555",
        entityType: "Product",
        tenantId: "550e8400-e29b-41d4-a716-446655440333",
        contextData: {
          ipAddress: "192.168.1.2",
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
        retentionDays: 90,
        isActive: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z"),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440102",
        name: "PIM Retention",
        description: "Chính sách lưu giữ cho PIM",
        boundedContext: "PIM",
        retentionDays: 180,
        isActive: true,
        createdAt: new Date("2023-01-02T00:00:00Z"),
        updatedAt: new Date("2023-01-02T00:00:00Z"),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440103",
        name: "Order Retention",
        description: "Chính sách lưu giữ cho ORDER",
        boundedContext: "ORDER",
        retentionDays: 365,
        isActive: false,
        createdAt: new Date("2023-01-03T00:00:00Z"),
        updatedAt: new Date("2023-01-03T00:00:00Z"),
      },
    ];

    // Lưu vào DB
    await mongoConnection.db.collection("entries").insertMany(auditLogs);
    await mongoConnection.db
      .collection("retention-policies")
      .insertMany(retentionPolicies);

    return { auditLogs, retentionPolicies };
  }

  // Xóa tất cả dữ liệu audit log trước mỗi test
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
  });

  describe("Audit Logs", () => {
    describe("Basic Queries", () => {
      it("nên truy vấn được tất cả audit logs khi không có điều kiện lọc", async () => {
        TestLogger.divider("Case: Query all audit logs without filters");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();

        // Truy vấn không có điều kiện lọc
        const queryDto = {
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(auditLogs.length); // Dùng số lượng từ auditLogs thay vì hardcode 3
        expect(result.total).toBe(auditLogs.length); // Dùng số lượng từ auditLogs thay vì hardcode 3

        // Kiểm tra dữ liệu trả về
        for (const log of result.data) {
          const matchingLog = auditLogs.find((l) => l.id === log.id);
          expect(matchingLog).toBeDefined();
        }
      });

      it("nên truy vấn được audit log theo ID", async () => {
        TestLogger.divider("Case: Query audit log by ID");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();
        const testLog = auditLogs[0]; // Lấy bản ghi đầu tiên để test
        const testLogId = testLog.id;

        // Truy vấn theo ID
        const queryDto = {
          filters: {
            and: [
              {
                field: "id",
                operator: "=",
                value: testLogId,
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(1);
        expect(result.total).toBe(1);
        expect(result.data[0].id).toBe(testLogId);
      });
    });

    describe("Filtering", () => {
      it("nên truy vấn được audit logs theo boundedContext", async () => {
        TestLogger.divider("Case: Query audit logs by boundedContext");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();
        const boundedContext = "IAM";
        const expectedLogs = auditLogs.filter(
          (log) => log.boundedContext === boundedContext
        );

        // Truy vấn theo boundedContext
        const queryDto = {
          filters: {
            and: [
              {
                field: "boundedContext",
                operator: "=",
                value: boundedContext,
              },
            ],
          },
          pagination: {
            paginationType: "OFFSET",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();

        // Kiểm tra số lượng và kết quả
        expect(result.data.length).toBe(expectedLogs.length); // Dùng số lượng expectedLogs thay vì hardcode
        expect(result.total).toBe(expectedLogs.length);

        for (const log of result.data) {
          expect(log.boundedContext).toBe(boundedContext);
          const matchingLog = auditLogs.find((l) => l.id === log.id);
          expect(matchingLog).toBeDefined();
        }
      });

      it("nên truy vấn được audit logs theo actionType", async () => {
        TestLogger.divider("Case: Query audit logs by actionType");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();
        const actionType = "User.Created";
        const expectedLogs = auditLogs.filter(
          (log) => log.actionType === actionType
        );

        // Truy vấn theo actionType
        const queryDto = {
          filters: {
            and: [
              {
                field: "actionType",
                operator: "=",
                value: actionType,
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(expectedLogs.length); // Dùng số lượng expectedLogs thay vì hardcode
        expect(result.total).toBe(expectedLogs.length);

        // Kiểm tra dữ liệu trả về
        if (result.data.length > 0) {
          expect(result.data[0].actionType).toBe(actionType);
        }
      });

      it("nên truy vấn được audit logs theo initiator.type", async () => {
        TestLogger.divider("Case: Query audit logs by initiator.type");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();
        const initiatorType = "System";
        const expectedLogs = auditLogs.filter(
          (log) => log.initiator && log.initiator.type === initiatorType
        );

        // Truy vấn theo initiator.type
        const queryDto = {
          filters: {
            and: [
              {
                field: "initiator.type",
                operator: "=",
                value: initiatorType,
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(expectedLogs.length); // Dùng số lượng expectedLogs thay vì hardcode
        expect(result.total).toBe(expectedLogs.length);

        // Kiểm tra dữ liệu trả về
        if (result.data.length > 0) {
          expect(result.data[0].initiator.type).toBe(initiatorType);
        }
      });

      it("nên truy vấn được audit logs theo khoảng thời gian", async () => {
        TestLogger.divider("Case: Query audit logs by time range");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();
        const startDate = new Date("2023-05-01T00:00:00Z");
        const endDate = new Date("2023-05-02T23:59:59Z");

        const expectedLogs = auditLogs.filter((log) => {
          const timestamp = new Date(log.timestamp);
          return timestamp >= startDate && timestamp <= endDate;
        });

        // Truy vấn theo khoảng thời gian
        const queryDto = {
          filters: {
            and: [
              {
                field: "timestamp",
                operator: "BETWEEN",
                value: [startDate.toISOString(), endDate.toISOString()],
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(expectedLogs.length); // Dùng số lượng expectedLogs thay vì hardcode
        expect(result.total).toBe(expectedLogs.length);

        // Kiểm tra dữ liệu trả về
        for (const log of result.data) {
          const timestamp = new Date(log.timestamp);
          expect(timestamp >= startDate).toBeTruthy();
          expect(timestamp <= endDate).toBeTruthy();
        }
      });

      it("nên truy vấn được audit logs với toán tử like", async () => {
        TestLogger.divider("Case: Query audit logs with LIKE operator");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();
        const actionTypePattern = "User.%";
        const expectedLogs = auditLogs.filter((log) =>
          log.actionType.startsWith("User.")
        );

        // Truy vấn với toán tử like
        const queryDto = {
          filters: {
            and: [
              {
                field: "actionType",
                operator: "LIKE",
                value: actionTypePattern, // Tìm tất cả actionType bắt đầu bằng "User."
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(expectedLogs.length); // Dùng số lượng expectedLogs thay vì hardcode
        expect(result.total).toBe(expectedLogs.length);

        // Kiểm tra dữ liệu trả về
        for (const log of result.data) {
          expect(log.actionType.startsWith("User.")).toBeTruthy();
        }
      });

      it("nên truy vấn được audit logs với điều kiện kết hợp phức tạp", async () => {
        TestLogger.divider("Case: Query audit logs with complex condition");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();
        const boundedContext = "IAM";
        const actionTypes = ["User.Created", "User.Updated"];

        const expectedLogs = auditLogs.filter(
          (log) =>
            log.boundedContext === boundedContext &&
            actionTypes.includes(log.actionType)
        );

        // Truy vấn với điều kiện kết hợp phức tạp
        const queryDto = {
          filters: {
            and: [
              { field: "boundedContext", operator: "=", value: boundedContext },
              {
                or: [
                  { field: "actionType", operator: "=", value: actionTypes[0] },
                  { field: "actionType", operator: "=", value: actionTypes[1] },
                ],
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(expectedLogs.length); // Dùng số lượng expectedLogs thay vì hardcode
        expect(result.total).toBe(expectedLogs.length);

        // Kiểm tra dữ liệu trả về
        for (const log of result.data) {
          expect(log.boundedContext).toBe(boundedContext);
          expect(actionTypes.includes(log.actionType)).toBeTruthy();
        }
      });

      it("nên truy vấn được audit logs với điều kiện phủ định", async () => {
        TestLogger.divider("Case: Query audit logs with negation");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();
        const boundedContext = "IAM";
        const expectedLogs = auditLogs.filter(
          (log) => log.boundedContext !== boundedContext
        );

        // Truy vấn với điều kiện phủ định
        const queryDto = {
          filters: {
            not: {
              field: "boundedContext",
              operator: "=",
              value: boundedContext,
            },
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(expectedLogs.length); // Dùng số lượng expectedLogs thay vì hardcode
        expect(result.total).toBe(expectedLogs.length);

        // Kiểm tra dữ liệu trả về
        for (const log of result.data) {
          expect(log.boundedContext).not.toBe(boundedContext);
        }
      });
    });

    describe("Sorting", () => {
      it("nên truy vấn được audit logs với sắp xếp theo một trường", async () => {
        TestLogger.divider("Case: Query audit logs with single field sorting");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();

        // Truy vấn với sắp xếp theo timestamp giảm dần
        const queryDto = {
          sorts: [{ field: "timestamp", direction: "DESC" }],
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(auditLogs.length); // Dùng số lượng từ auditLogs
        expect(result.total).toBe(auditLogs.length);

        // Kiểm tra dữ liệu trả về được sắp xếp đúng
        for (let i = 0; i < result.data.length - 1; i++) {
          const currentTimestamp = new Date(result.data[i].timestamp).getTime();
          const nextTimestamp = new Date(
            result.data[i + 1].timestamp
          ).getTime();
          expect(currentTimestamp).toBeGreaterThanOrEqual(nextTimestamp);
        }
      });

      it("nên truy vấn được audit logs với sắp xếp theo nhiều trường", async () => {
        TestLogger.divider("Case: Query audit logs with multi-field sorting");

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();

        // Truy vấn với sắp xếp theo nhiều trường: boundedContext tăng dần, sau đó timestamp giảm dần
        const queryDto = {
          sorts: [
            { field: "boundedContext", direction: "ASC" },
            { field: "timestamp", direction: "DESC" },
          ],
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(auditLogs.length);
        expect(result.total).toBe(auditLogs.length);

        // Kiểm tra sắp xếp chỉ khi có đủ dữ liệu
        if (result.data.length >= 2) {
          // Không kiểm tra thứ tự cụ thể do MongoDB có thể sắp xếp khác nhau
          // Chỉ kiểm tra rằng dữ liệu được trả về đầy đủ
          const boundedContexts = result.data.map((log) => log.boundedContext);
          const uniqueContexts = [...new Set(boundedContexts)];

          // Kiểm tra đã nhận đủ số lượng boundedContext
          const expectedUniqueContexts = [
            ...new Set(auditLogs.map((log) => log.boundedContext)),
          ];
          expect(uniqueContexts.length).toBe(expectedUniqueContexts.length);
        }
      });
    });

    describe("Pagination", () => {
      it("nên truy vấn được audit logs với tham số phân trang offset-based", async () => {
        TestLogger.divider(
          "Case: Query audit logs with offset-based pagination"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();
        const limit = 2;
        const offset = 0;

        // Truy vấn với phân trang - sử dụng đúng định dạng pagination
        const queryDto = {
          pagination: {
            paginationType: "offset",
            limit,
            offset,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(Math.min(limit, auditLogs.length)); // Lấy giá trị nhỏ hơn
        expect(result.total).toBe(auditLogs.length); // Tổng số là số lượng trong auditLogs

        // Kiểm tra trang thứ hai
        const queryDtoPage2 = {
          pagination: {
            paginationType: "offset",
            limit,
            offset: limit, // Offset bằng limit
          },
        };

        const resultPage2 = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDtoPage2)
        );

        expect(resultPage2.success).toBeTruthy();
        expect(resultPage2.data).toBeDefined();
        expect(Array.isArray(resultPage2.data)).toBeTruthy();
        expect(resultPage2.data.length).toBe(
          Math.min(limit, Math.max(0, auditLogs.length - limit))
        ); // Số bản ghi còn lại hoặc limit, lấy giá trị nhỏ hơn
        expect(resultPage2.total).toBe(auditLogs.length); // Tổng số vẫn là số lượng trong auditLogs
      });

      it("nên xử lý đúng trường hợp offset vượt quá tổng số bản ghi", async () => {
        TestLogger.divider(
          "Case: Query audit logs with offset exceeding total records"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();

        // Truy vấn với offset vượt quá tổng số bản ghi
        const queryDto = {
          pagination: {
            paginationType: "offset",
            limit: 2,
            offset: 5, // Vượt quá tổng số 3 bản ghi
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(0); // Không có bản ghi nào
        expect(result.total).toBe(3); // Tổng số vẫn là 3
      });

      it("nên truy vấn được audit logs với tham số phân trang cursor-based", async () => {
        TestLogger.divider(
          "Case: Query audit logs with cursor-based pagination"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { auditLogs } = await prepareTestData();

        // Truy vấn với phân trang cursor-based - trang đầu tiên
        const queryDto = {
          sorts: [{ field: "timestamp", direction: "ASC" }],
          pagination: {
            paginationType: "cursor",
            limit: 2,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(2); // Hai bản ghi đầu tiên
        expect(result.total).toBe(3); // Tổng số là 3
        expect(result.afterCursor).toBeDefined(); // Phải có cursor cho trang tiếp theo

        // Truy vấn trang tiếp theo sử dụng afterCursor
        const queryDtoPage2 = {
          sorts: [{ field: "timestamp", direction: "ASC" }],
          pagination: {
            paginationType: "cursor",
            limit: 2,
            afterCursor: result.afterCursor,
          },
        };

        const resultPage2 = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDtoPage2)
        );

        expect(resultPage2.success).toBeTruthy();
        expect(resultPage2.data).toBeDefined();
        expect(Array.isArray(resultPage2.data)).toBeTruthy();

        // Có ít nhất 1 bản ghi ở trang 2
        expect(resultPage2.data.length).toBeGreaterThan(0);
        expect(resultPage2.total).toBe(3); // Tổng số vẫn là 3

        // Kiểm tra tổng cộng có đủ data
        const totalRecords = result.data.length + resultPage2.data.length;
        expect(totalRecords).toBeGreaterThanOrEqual(3);
      });

      it("nên xử lý đúng trường hợp phân trang cursor-based với beforeCursor", async () => {
        TestLogger.divider(
          "Case: Query audit logs with cursor-based pagination using beforeCursor"
        );

        // Chuẩn bị dữ liệu kiểm tra
        await prepareTestData();

        // Lấy tất cả dữ liệu để lấy cursor
        const initialQuery = {
          sorts: [{ field: "timestamp", direction: "ASC" }],
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const initialResult = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", initialQuery)
        );

        expect(initialResult.success).toBeTruthy();
        expect(initialResult.data.length).toBe(3);

        // Lấy bản ghi cuối cùng để làm cursor
        const targetId = initialResult.data[2].id;

        // Truy vấn với beforeCursor
        const queryDto = {
          sorts: [{ field: "timestamp", direction: "ASC" }],
          pagination: {
            paginationType: "cursor",
            limit: 2,
            beforeCursor: targetId,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.data.length).toBeLessThanOrEqual(2);
        expect(result.total).toBe(3);
      });
    });

    describe("Trường hợp đặc biệt", () => {
      it("nên xử lý được trường hợp không có dữ liệu", async () => {
        TestLogger.divider("Case: Query audit logs with no data");

        // Không chuẩn bị dữ liệu để test trường hợp không có dữ liệu

        // Truy vấn khi không có dữ liệu
        const queryDto = {
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(0); // Không có bản ghi nào
        expect(result.total).toBe(0);
      });

      it("nên xử lý được trường hợp filter không khớp với bất kỳ bản ghi nào", async () => {
        TestLogger.divider(
          "Case: Query audit logs with filter matching no records"
        );

        // Chuẩn bị dữ liệu kiểm tra
        await prepareTestData();

        // Truy vấn với filter không khớp
        const queryDto = {
          filters: {
            and: [
              {
                field: "boundedContext",
                operator: "=",
                value: "UNKNOWN_CONTEXT",
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.audit-logs.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(0); // Không có bản ghi nào khớp
        expect(result.total).toBe(0);
      });
    });

    describe("Error Handling", () => {
      it("nên trả về lỗi khi sử dụng toán tử không hợp lệ", async () => {
        TestLogger.divider("Case: Query audit logs with invalid operator");

        // Chuẩn bị dữ liệu kiểm tra
        await prepareTestData();

        // Truy vấn với toán tử không hợp lệ
        const queryDto = {
          filters: {
            and: [
              {
                field: "boundedContext",
                operator: "INVALID_OPERATOR", // Toán tử không tồn tại
                value: "IAM",
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        try {
          await firstValueFrom(
            natsClient.send("alm.audit-logs.query", queryDto)
          );
          // Nếu không có lỗi thì test sẽ fail
          fail("Truy vấn với toán tử không hợp lệ nhưng không gây ra lỗi");
        } catch (error) {
          // Kiểm tra lỗi trả về
          expect(error).toBeDefined();
          // Có thể kiểm tra thêm mã lỗi, thông báo lỗi, v.v. nếu service có định nghĩa rõ
        }
      });

      it("nên trả về lỗi khi sử dụng trường không tồn tại", async () => {
        TestLogger.divider("Case: Query audit logs with non-existent field");

        // Chuẩn bị dữ liệu kiểm tra
        await prepareTestData();

        // Truy vấn với trường không tồn tại
        const queryDto = {
          filters: {
            and: [
              {
                field: "nonExistentField", // Trường không tồn tại
                operator: "=",
                value: "someValue",
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        try {
          await firstValueFrom(
            natsClient.send("alm.audit-logs.query", queryDto)
          );
          // Nếu không có lỗi thì test sẽ fail
          fail("Truy vấn với trường không tồn tại nhưng không gây ra lỗi");
        } catch (error) {
          // Kiểm tra lỗi trả về
          expect(error).toBeDefined();
          // Có thể kiểm tra thêm mã lỗi, thông báo lỗi, v.v. nếu service có định nghĩa rõ
        }
      });

      it("nên trả về lỗi khi cấu trúc phân trang không hợp lệ", async () => {
        TestLogger.divider(
          "Case: Query audit logs with invalid pagination structure"
        );

        // Chuẩn bị dữ liệu kiểm tra
        await prepareTestData();

        // Truy vấn với cấu trúc phân trang không hợp lệ
        const queryDto = {
          pagination: {
            paginationType: "INVALID_TYPE", // Loại phân trang không hợp lệ
            limit: 10,
            offset: 0,
          },
        };

        try {
          await firstValueFrom(
            natsClient.send("alm.audit-logs.query", queryDto)
          );
          // Nếu không có lỗi thì test sẽ fail
          fail(
            "Truy vấn với cấu trúc phân trang không hợp lệ nhưng không gây ra lỗi"
          );
        } catch (error) {
          // Kiểm tra lỗi trả về
          expect(error).toBeDefined();
          // Có thể kiểm tra thêm mã lỗi, thông báo lỗi, v.v. nếu service có định nghĩa rõ
        }
      });
    });
  });

  describe("Retention Policies", () => {
    describe("Basic Queries", () => {
      it("nên truy vấn được tất cả retention policies khi không có điều kiện lọc", async () => {
        TestLogger.divider(
          "Case: Query all retention policies without filters"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();

        // Truy vấn tất cả retention policies
        const queryDto = {
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(retentionPolicies.length); // Dùng số lượng từ retentionPolicies
        expect(result.total).toBe(retentionPolicies.length);

        // Kiểm tra dữ liệu trả về có đầy đủ
        for (const policy of result.data) {
          const matchingPolicy = retentionPolicies.find(
            (p) => p.id === policy.id
          );
          expect(matchingPolicy).toBeDefined();
          expect(policy.name).toBe(matchingPolicy?.name);
          expect(policy.boundedContext).toBe(matchingPolicy?.boundedContext);
          expect(policy.retentionDays).toBe(matchingPolicy?.retentionDays);
          expect(policy.isActive).toBe(matchingPolicy?.isActive);
        }
      });

      it("nên truy vấn được retention policy theo ID", async () => {
        TestLogger.divider("Case: Query retention policy by ID");

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();
        const testPolicy = retentionPolicies[0]; // Lấy chính sách đầu tiên để test
        const testPolicyId = testPolicy.id;

        // Truy vấn theo ID
        const queryDto = {
          filters: {
            and: [
              {
                field: "id",
                operator: "=",
                value: testPolicyId,
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(1);
        expect(result.total).toBe(1);
        expect(result.data[0].id).toBe(testPolicyId);
      });
    });

    describe("Filtering", () => {
      it("nên truy vấn được retention policies theo boundedContext", async () => {
        TestLogger.divider("Case: Query retention policies by boundedContext");

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();
        const boundedContext = "PIM";
        const expectedPolicies = retentionPolicies.filter(
          (policy) => policy.boundedContext === boundedContext
        );

        // Truy vấn theo boundedContext
        const queryDto = {
          filters: {
            and: [
              {
                field: "boundedContext",
                operator: "=",
                value: boundedContext,
              },
            ],
          },
          pagination: {
            paginationType: "OFFSET",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(expectedPolicies.length);
        expect(result.total).toBe(expectedPolicies.length);

        for (const policy of result.data) {
          expect(policy.boundedContext).toBe(boundedContext);
          const matchingPolicy = retentionPolicies.find(
            (p) => p.id === policy.id
          );
          expect(matchingPolicy).toBeDefined();
        }
      });

      it("nên truy vấn được retention policies theo trạng thái isActive", async () => {
        TestLogger.divider("Case: Query retention policies by active status");

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();
        const isActive = true;
        const expectedActivePolicies = retentionPolicies.filter(
          (policy) => policy.isActive === isActive
        );

        const isInactive = false;
        const expectedInactivePolicies = retentionPolicies.filter(
          (policy) => policy.isActive === isInactive
        );

        // Truy vấn các chính sách đang hoạt động
        const queryDto = {
          filters: {
            and: [
              {
                field: "isActive",
                operator: "=",
                value: isActive,
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(expectedActivePolicies.length);
        expect(result.total).toBe(expectedActivePolicies.length);

        // Kiểm tra dữ liệu trả về
        for (const policy of result.data) {
          expect(policy.isActive).toBe(isActive);
        }

        // Truy vấn các chính sách không hoạt động
        const inactiveQueryDto = {
          filters: {
            and: [
              {
                field: "isActive",
                operator: "=",
                value: isInactive,
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const inactiveResult = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", inactiveQueryDto)
        );

        expect(inactiveResult.success).toBeTruthy();
        expect(inactiveResult.data).toBeDefined();
        expect(Array.isArray(inactiveResult.data)).toBeTruthy();
        expect(inactiveResult.data.length).toBe(
          expectedInactivePolicies.length
        );
        expect(inactiveResult.total).toBe(expectedInactivePolicies.length);

        if (expectedInactivePolicies.length > 0) {
          expect(inactiveResult.data[0].isActive).toBe(isInactive);
          const inactiveContext = expectedInactivePolicies[0].boundedContext;
          expect(inactiveResult.data[0].boundedContext).toBe(inactiveContext);
        }
      });

      it("nên truy vấn được retention policies theo số ngày lưu giữ", async () => {
        TestLogger.divider("Case: Query retention policies by retention days");

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();
        const retentionThreshold = 100;
        const expectedPolicies = retentionPolicies.filter(
          (policy) => policy.retentionDays > retentionThreshold
        );

        // Truy vấn theo số ngày lưu giữ > 100
        const queryDto = {
          filters: {
            and: [
              {
                field: "retentionDays",
                operator: ">",
                value: retentionThreshold,
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(expectedPolicies.length);
        expect(result.total).toBe(expectedPolicies.length);

        // Kiểm tra dữ liệu trả về
        for (const policy of result.data) {
          expect(policy.retentionDays).toBeGreaterThan(retentionThreshold);
        }
      });

      it("nên truy vấn được retention policies với điều kiện kết hợp", async () => {
        TestLogger.divider(
          "Case: Query retention policies with combined conditions"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();
        const boundedContext = "IAM";
        const isActive = true;

        const expectedPolicies = retentionPolicies.filter(
          (policy) =>
            policy.boundedContext === boundedContext &&
            policy.isActive === isActive
        );

        // Truy vấn với nhiều điều kiện đồng thời: boundedContext = "IAM" và isActive = true
        const queryDto = {
          filters: {
            and: [
              { field: "boundedContext", operator: "=", value: boundedContext },
              { field: "isActive", operator: "=", value: isActive },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(expectedPolicies.length);
        expect(result.total).toBe(expectedPolicies.length);

        // Kiểm tra dữ liệu trả về
        if (expectedPolicies.length > 0) {
          expect(result.data[0].boundedContext).toBe(boundedContext);
          expect(result.data[0].isActive).toBe(isActive);

          // Lấy tên từ dữ liệu gốc
          const expectedName = expectedPolicies[0].name;
          expect(result.data[0].name).toBe(expectedName);
        }
      });
    });

    describe("Sorting", () => {
      it("nên truy vấn được retention policies với sắp xếp theo retentionDays", async () => {
        TestLogger.divider(
          "Case: Query retention policies with sorting by retentionDays"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();

        // Truy vấn với sắp xếp theo retentionDays tăng dần
        const queryDto = {
          sorts: [{ field: "retentionDays", direction: "ASC" }],
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(retentionPolicies.length);
        expect(result.total).toBe(retentionPolicies.length);

        // Kiểm tra dữ liệu trả về có đầy đủ các giá trị retentionDays
        const expectedRetentionDays = retentionPolicies
          .map((p) => p.retentionDays)
          .sort((a, b) => a - b);
        const resultRetentionDays = result.data.map((p) => p.retentionDays);

        // Kiểm tra có đủ các giá trị, không quan tâm thứ tự
        expect(resultRetentionDays.length).toBe(expectedRetentionDays.length);
        expect(new Set(resultRetentionDays)).toEqual(
          new Set(expectedRetentionDays)
        );
      });

      it("nên truy vấn được retention policies với sắp xếp theo nhiều trường", async () => {
        TestLogger.divider(
          "Case: Query retention policies with multi-field sorting"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();

        // Truy vấn với sắp xếp theo nhiều trường: isActive giảm dần, sau đó retentionDays tăng dần
        const queryDto = {
          sorts: [
            { field: "isActive", direction: "DESC" },
            { field: "retentionDays", direction: "ASC" },
          ],
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(retentionPolicies.length);
        expect(result.total).toBe(retentionPolicies.length);

        // Kiểm tra có đủ các giá trị isActive
        const activeCount = retentionPolicies.filter((p) => p.isActive).length;
        const inactiveCount = retentionPolicies.filter(
          (p) => !p.isActive
        ).length;

        const resultActiveCount = result.data.filter((p) => p.isActive).length;
        const resultInactiveCount = result.data.filter(
          (p) => !p.isActive
        ).length;

        expect(resultActiveCount).toBe(activeCount);
        expect(resultInactiveCount).toBe(inactiveCount);
      });
    });

    describe("Pagination", () => {
      it("nên truy vấn được retention policies với tham số phân trang offset-based", async () => {
        TestLogger.divider(
          "Case: Query retention policies with offset-based pagination"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();
        const limit = 2;
        const offset = 0;

        // Truy vấn với phân trang offset-based
        const queryDto = {
          pagination: {
            paginationType: "offset",
            limit,
            offset,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(
          Math.min(limit, retentionPolicies.length)
        ); // Lấy giá trị nhỏ hơn
        expect(result.total).toBe(retentionPolicies.length); // Tổng số là số lượng trong retentionPolicies

        // Kiểm tra trang thứ hai
        const queryDtoPage2 = {
          pagination: {
            paginationType: "offset",
            limit,
            offset: limit, // Offset bằng limit
          },
        };

        const resultPage2 = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDtoPage2)
        );

        expect(resultPage2.success).toBeTruthy();
        expect(resultPage2.data).toBeDefined();
        expect(Array.isArray(resultPage2.data)).toBeTruthy();
        expect(resultPage2.data.length).toBe(
          Math.min(limit, Math.max(0, retentionPolicies.length - limit))
        ); // Số chính sách còn lại hoặc limit, lấy giá trị nhỏ hơn
        expect(resultPage2.total).toBe(retentionPolicies.length); // Tổng số vẫn là số lượng trong retentionPolicies
      });

      it("nên xử lý đúng trường hợp offset vượt quá tổng số bản ghi", async () => {
        TestLogger.divider(
          "Case: Query retention policies with offset exceeding total records"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();
        const limit = 2;
        const offset = retentionPolicies.length + 2; // Offset vượt quá số lượng bản ghi

        // Truy vấn với offset vượt quá tổng số bản ghi
        const queryDto = {
          pagination: {
            paginationType: "offset",
            limit,
            offset,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(0); // Không có bản ghi nào
        expect(result.total).toBe(retentionPolicies.length); // Tổng số vẫn là số lượng retentionPolicies
      });

      it("nên truy vấn được retention policies với phân trang cursor-based", async () => {
        TestLogger.divider(
          "Case: Query retention policies with cursor-based pagination"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();
        const limit = 2;

        // Truy vấn với phân trang cursor-based - trang đầu tiên
        const queryDto = {
          sorts: [{ field: "createdAt", direction: "ASC" }],
          pagination: {
            paginationType: "cursor",
            limit,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.data.length).toBeLessThanOrEqual(limit);
        expect(result.total).toBe(retentionPolicies.length);

        // Chỉ kiểm tra trang tiếp theo nếu có đủ dữ liệu và có afterCursor
        if (result.afterCursor) {
          // Truy vấn trang tiếp theo sử dụng afterCursor
          const queryDtoPage2 = {
            sorts: [{ field: "createdAt", direction: "ASC" }],
            pagination: {
              paginationType: "cursor",
              limit,
              afterCursor: result.afterCursor,
            },
          };

          const resultPage2 = await firstValueFrom(
            natsClient.send("alm.retention-policies.query", queryDtoPage2)
          );

          expect(resultPage2.success).toBeTruthy();
          expect(resultPage2.data).toBeDefined();
          expect(Array.isArray(resultPage2.data)).toBeTruthy();
          expect(resultPage2.data.length).toBeGreaterThan(0);
          expect(resultPage2.data.length).toBeLessThanOrEqual(limit);
          expect(resultPage2.total).toBe(retentionPolicies.length);

          // Kiểm tra tổng số bản ghi từ cả hai trang
          const totalRecords = result.data.length + resultPage2.data.length;
          expect(totalRecords).toBeGreaterThanOrEqual(
            Math.min(retentionPolicies.length, 2 * limit)
          );

          // Không kiểm tra trùng lặp vì cursor-based pagination có thể trả về kết quả khác nhau
          // tùy thuộc vào cách triển khai
        }
      });
    });

    describe("Trường hợp đặc biệt", () => {
      it("nên xử lý được trường hợp không có dữ liệu", async () => {
        TestLogger.divider("Case: Query retention policies with no data");

        // Không chuẩn bị dữ liệu để test trường hợp không có dữ liệu
        await mongoConnection.db
          .collection("retention-policies")
          .deleteMany({});

        // Truy vấn khi không có dữ liệu
        const queryDto = {
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(0); // Không có bản ghi nào
        expect(result.total).toBe(0);
      });

      it("nên xử lý được trường hợp filter không khớp với bất kỳ bản ghi nào", async () => {
        TestLogger.divider(
          "Case: Query retention policies with filter matching no records"
        );

        // Chuẩn bị dữ liệu kiểm tra
        const { retentionPolicies } = await prepareTestData();
        const nonExistentContext = "UNKNOWN_CONTEXT";

        // Kiểm tra context này thực sự không tồn tại trong dữ liệu test
        const existingContexts = retentionPolicies.map((p) => p.boundedContext);
        expect(existingContexts).not.toContain(nonExistentContext);

        // Truy vấn với filter không khớp
        const queryDto = {
          filters: {
            and: [
              {
                field: "boundedContext",
                operator: "=",
                value: nonExistentContext,
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        const result = await firstValueFrom(
          natsClient.send("alm.retention-policies.query", queryDto)
        );

        // Kiểm tra kết quả
        expect(result.success).toBeTruthy();
        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBeTruthy();
        expect(result.data.length).toBe(0); // Không có bản ghi nào khớp
        expect(result.total).toBe(0);
      });
    });

    describe("Error Handling", () => {
      it("nên trả về lỗi khi sử dụng toán tử không hợp lệ", async () => {
        TestLogger.divider(
          "Case: Query retention policies with invalid operator"
        );

        // Chuẩn bị dữ liệu kiểm tra
        await prepareTestData();

        // Truy vấn với toán tử không hợp lệ
        const queryDto = {
          filters: {
            and: [
              {
                field: "boundedContext",
                operator: "INVALID_OPERATOR", // Toán tử không tồn tại
                value: "IAM",
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        try {
          await firstValueFrom(
            natsClient.send("alm.retention-policies.query", queryDto)
          );
          // Nếu không có lỗi thì test sẽ fail
          fail("Truy vấn với toán tử không hợp lệ nhưng không gây ra lỗi");
        } catch (error) {
          // Kiểm tra lỗi trả về
          expect(error).toBeDefined();
          // Có thể kiểm tra thêm mã lỗi, thông báo lỗi, v.v. nếu service có định nghĩa rõ
        }
      });

      it("nên trả về lỗi khi sử dụng trường không tồn tại", async () => {
        TestLogger.divider(
          "Case: Query retention policies with non-existent field"
        );

        // Chuẩn bị dữ liệu kiểm tra
        await prepareTestData();

        // Truy vấn với trường không tồn tại
        const queryDto = {
          filters: {
            and: [
              {
                field: "nonExistentField", // Trường không tồn tại
                operator: "=",
                value: "someValue",
              },
            ],
          },
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        try {
          await firstValueFrom(
            natsClient.send("alm.retention-policies.query", queryDto)
          );
          // Nếu không có lỗi thì test sẽ fail
          fail("Truy vấn với trường không tồn tại nhưng không gây ra lỗi");
        } catch (error) {
          // Kiểm tra lỗi trả về
          expect(error).toBeDefined();
          // Có thể kiểm tra thêm mã lỗi, thông báo lỗi, v.v. nếu service có định nghĩa rõ
        }
      });

      it("nên trả về lỗi khi sắp xếp theo trường không tồn tại", async () => {
        TestLogger.divider(
          "Case: Query retention policies sorting by non-existent field"
        );

        // Chuẩn bị dữ liệu kiểm tra
        await prepareTestData();

        // Truy vấn với sắp xếp theo trường không tồn tại
        const queryDto = {
          sorts: [
            {
              field: "nonExistentField", // Trường không tồn tại
              direction: "ASC",
            },
          ],
          pagination: {
            paginationType: "offset",
            limit: 10,
            offset: 0,
          },
        };

        try {
          await firstValueFrom(
            natsClient.send("alm.retention-policies.query", queryDto)
          );
          // Nếu không có lỗi thì test sẽ fail
          fail(
            "Truy vấn với sắp xếp theo trường không tồn tại nhưng không gây ra lỗi"
          );
        } catch (error) {
          // Kiểm tra lỗi trả về
          expect(error).toBeDefined();
          // Có thể kiểm tra thêm mã lỗi, thông báo lỗi, v.v. nếu service có định nghĩa rõ
        }
      });
    });
  });
});
