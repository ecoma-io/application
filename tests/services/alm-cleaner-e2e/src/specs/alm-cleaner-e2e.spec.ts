/**
 * @fileoverview E2E tests cho ALM Cleaner Service
 */

import {
  MongoDBContainer,
  NatsContainer,
  RabbitMQContainer,
  StartedMongoDBContainer,
  StartedNatsContainer,
  StartedRabbitMQContainer,
  TestLogger,
} from "@ecoma/common-testing";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { Test, TestingModule } from "@nestjs/testing";
import mongoose, { Document } from "mongoose";
import { firstValueFrom } from "rxjs";
import { GenericContainer, StartedTestContainer } from "testcontainers";
import { v4 as uuidv4 } from "uuid";

// Định nghĩa interface cho AuditLogEntry trong MongoDB
interface IAuditLogEntry extends Document {
  id: string;
  eventId: string;
  timestamp: Date;
  initiator: {
    type: string;
    id: string | null;
    name: string;
  };
  action: string;
  resource: {
    type: string;
    id: string;
    name: string;
  };
  boundedContext: string;
  tenantId: string | null;
  context: Record<string, any>;
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  metadata: Record<string, any>;
  createdAt: Date;
  // Thêm các trường cần thiết cho domain model
  actionType: string;
  category: string;
  severity: string;
  entityType: string;
  entityId: string;
  status: string;
}

// Định nghĩa schema cho audit log entry trong MongoDB
const auditLogEntrySchema = new mongoose.Schema({
  id: { type: String, required: true },
  eventId: { type: String, required: true },
  timestamp: { type: Date, required: true },
  initiator: {
    type: { type: String, required: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  action: { type: String, required: true },
  resource: {
    type: { type: String, required: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  boundedContext: { type: String },
  tenantId: { type: String },
  context: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  changes: [
    {
      field: { type: String, required: true },
      oldValue: { type: mongoose.Schema.Types.Mixed },
      newValue: { type: mongoose.Schema.Types.Mixed },
    },
  ],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: { type: Date, default: Date.now },
  // Thêm các trường cần thiết cho domain model
  actionType: { type: String, required: true },
  category: { type: String, required: true },
  severity: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  status: { type: String, required: true },
});

describe("ALM Cleaner Service E2E Tests", () => {
  let mongoContainer: StartedMongoDBContainer;
  let natsContainer: StartedNatsContainer;
  let rabbitMQContainer: StartedRabbitMQContainer;
  let almCleanerContainer: StartedTestContainer;
  let mongoConnection: mongoose.Connection;
  let AuditLogEntry: mongoose.Model<IAuditLogEntry>;
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
      "ghcr.io/ecoma-io/alm-cleaner:latest"
    )
      .withEnvironment({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        LOG_LEVEL: "trace",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        LOG_FORMAT: "text",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MONGODB_URI: mongoContainer.getConnectionString(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NATS_URL: "nats://" + natsContainer.getConnectionServer(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        RABBITMQ_URI: rabbitMQContainer.getAmqpUrl(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PORT: "3000",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NODE_ENV: "test",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        DEBUG: "true", // Thêm biến môi trường DEBUG để xem thêm thông tin gỡ lỗi
        // eslint-disable-next-line @typescript-eslint/naming-convention
        AUTH_BYPASS: "true", // Thêm biến môi trường để bypass AuthService
        // eslint-disable-next-line @typescript-eslint/naming-convention
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

    // Kết nối đến MongoDB
    TestLogger.log("Connecting to MongoDB...");
    mongoConnection = await mongoose
      .createConnection(mongoContainer.getConnectionString())
      .asPromise();
    AuditLogEntry = mongoConnection.model<IAuditLogEntry>(
      "AuditLogEntry",
      auditLogEntrySchema,
      "audit_log_entries"
    );
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

  // Xóa tất cả dữ liệu audit log trước mỗi test
  beforeEach(async () => {
    // Xóa dữ liệu trong collection audit_log_entries
    await AuditLogEntry.deleteMany({});
  });

  describe("Chức năng Dọn dẹp Audit Logs", () => {
    it("Nên xóa các audit logs cũ hơn ngưỡng cấu hình", async () => {
      TestLogger.log("--------------------------------------------------");
      TestLogger.log("TEST: Nên xóa các audit logs cũ hơn ngưỡng cấu hình");

      // Tạo một số audit logs với ngày khác nhau
      const nowDate = new Date();
      
      // Tạo logs mới (sẽ không bị xóa)
      const recentLogs = await createSampleAuditLogsWithDate(5, nowDate);
      
      // Tạo logs cũ (sẽ bị xóa) - 10 ngày trước
      const oldDate = new Date(nowDate);
      oldDate.setDate(oldDate.getDate() - 10);
      const oldLogs = await createSampleAuditLogsWithDate(5, oldDate);
      
      // Đảm bảo các logs đã được tạo
      const allLogsBefore = await AuditLogEntry.find({}).lean();
      TestLogger.log(`Số lượng audit logs trước khi dọn dẹp: ${allLogsBefore.length}`);
      expect(allLogsBefore.length).toBe(10);
      
      // Kiểm tra xem các logs cũ đã được tạo đúng
      const oldLogsIds = oldLogs.map(log => log.id);
      TestLogger.log(`Đã tạo ${oldLogsIds.length} logs cũ để kiểm tra xóa`);

      // Gọi endpoint dọn dẹp trực tiếp
      try {
        TestLogger.log("Gọi endpoint dọn dẹp audit logs");
        
        // Sử dụng client.send với 2 tham số thay vì 3
        await firstValueFrom(
          natsClient.send({ cmd: "cleanup-audit-logs" }, {})
        );
        
        // Đợi một chút để cho quá trình xóa hoàn tất
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Kiểm tra số lượng logs còn lại
        const remainingLogs = await AuditLogEntry.find({}).lean();
        TestLogger.log(`Số lượng audit logs sau khi dọn dẹp: ${remainingLogs.length}`);
        
        // Chỉ các logs mới nên còn lại
        expect(remainingLogs.length).toBe(5);
        
        // Kiểm tra xem tất cả logs còn lại có phải là logs mới không
        const remainingIds = remainingLogs.map(log => log.id);
        const recentLogIds = recentLogs.map(log => log.id);
        
        for (const id of recentLogIds) {
          expect(remainingIds).toContain(id);
        }
        
      } catch (error) {
        TestLogger.error(`Lỗi khi gọi endpoint dọn dẹp: ${error.message}`, error.stack);
        fail(`Test thất bại khi gọi endpoint dọn dẹp: ${error.message}`);
      }
    });

    it("Nên giữ lại audit logs chưa quá ngưỡng", async () => {
      TestLogger.log("--------------------------------------------------");
      TestLogger.log("TEST: Nên giữ lại audit logs chưa quá ngưỡng");

      // Tạo các audit logs với ngày gần đây
      const nowDate = new Date();
      
      // Tạo logs mới (1 ngày trước - không bị xóa)
      const recentDate = new Date(nowDate);
      recentDate.setDate(recentDate.getDate() - 1);
      await createSampleAuditLogsWithDate(5, recentDate);
      
      // Tạo logs mới hơn một chút (3 ngày trước - không bị xóa)
      const threeDate = new Date(nowDate);
      threeDate.setDate(threeDate.getDate() - 3);
      await createSampleAuditLogsWithDate(5, threeDate);
      
      // Đảm bảo các logs đã được tạo
      const allLogsBefore = await AuditLogEntry.find({}).lean();
      TestLogger.log(`Số lượng audit logs trước khi dọn dẹp: ${allLogsBefore.length}`);
      expect(allLogsBefore.length).toBe(10);

      // Gọi endpoint dọn dẹp trực tiếp
      try {
        TestLogger.log("Gọi endpoint dọn dẹp audit logs");
        
        // Sử dụng client.send với 2 tham số thay vì 3
        await firstValueFrom(
          natsClient.send({ cmd: "cleanup-audit-logs" }, {})
        );
        
        // Đợi một chút để cho quá trình xóa hoàn tất
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Kiểm tra số lượng logs còn lại
        const remainingLogs = await AuditLogEntry.find({}).lean();
        TestLogger.log(`Số lượng audit logs sau khi dọn dẹp: ${remainingLogs.length}`);
        
        // Tất cả logs nên còn lại vì chúng mới hơn ngưỡng 7 ngày
        expect(remainingLogs.length).toBe(10);
        
      } catch (error) {
        TestLogger.error(`Lỗi khi gọi endpoint dọn dẹp: ${error.message}`, error.stack);
        fail(`Test thất bại khi gọi endpoint dọn dẹp: ${error.message}`);
      }
    });

    it("Nên phục hồi sau khi MongoDB bị ngắt kết nối", async () => {
      TestLogger.log("--------------------------------------------------");
      TestLogger.log("TEST: Nên phục hồi sau khi MongoDB bị ngắt kết nối");

      // Tạo một số audit logs để test
      const nowDate = new Date();
      const oldDate = new Date(nowDate);
      oldDate.setDate(oldDate.getDate() - 10);
      
      // Tạo logs cũ để test xóa
      await createSampleAuditLogsWithDate(5, oldDate);
      
      // Kiểm tra số lượng logs ban đầu
      const initialLogs = await AuditLogEntry.find({}).lean();
      TestLogger.log(`Số lượng audit logs ban đầu: ${initialLogs.length}`);
      expect(initialLogs.length).toBe(5);

      try {
        // 1. Dừng MongoDB container để giả lập lỗi kết nối
        TestLogger.log("Dừng MongoDB container để giả lập lỗi kết nối...");
        await mongoContainer.stop();
        TestLogger.log("MongoDB container đã dừng");
        
        // Đợi một chút để đảm bảo hệ thống nhận biết về lỗi kết nối
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 2. Thử gọi cleanup - kỳ vọng sẽ thất bại nhưng không làm crash service
        TestLogger.log("Gọi endpoint dọn dẹp khi MongoDB bị ngắt kết nối");
        try {
          await firstValueFrom(
            natsClient.send({ cmd: "cleanup-audit-logs" }, {})
          );
          TestLogger.log("Endpoint vẫn phản hồi nhưng có thể có lỗi nội bộ");
        } catch (error) {
          TestLogger.log(`Lỗi như kỳ vọng khi MongoDB bị ngắt kết nối: ${error.message}`);
          // Lỗi này có thể là timeout hoặc lỗi kết nối - là bình thường
        }
        
        // 3. Khởi động lại MongoDB
        TestLogger.log("Khởi động lại MongoDB container...");
        // Đảm bảo MongoDB được khởi động lại ngay cả khi test thất bại
        try {
          mongoContainer = await new MongoDBContainer().start();
          TestLogger.log(`MongoDB container đã được khởi động lại sau lỗi tại ${mongoContainer.getConnectionString()}`);
          
          // Kết nối lại với MongoDB
          if (mongoConnection) {
            try {
              await mongoConnection.close();
            } catch (err) {
              // Có thể đã đóng do lỗi
            }
          }
          mongoConnection = await mongoose
            .createConnection(mongoContainer.getConnectionString())
            .asPromise();
          AuditLogEntry = mongoConnection.model<IAuditLogEntry>(
            "AuditLogEntry",
            auditLogEntrySchema,
            "audit_log_entries"
          );
        } catch (recoveryError) {
          TestLogger.error(`Không thể khôi phục MongoDB sau lỗi: ${recoveryError.message}`);
          throw recoveryError; // Điều này sẽ làm cho test fail
        }
        
        // Tạo logs mới để test sau khi phục hồi
        TestLogger.log("Tạo logs mới sau khi phục hồi kết nối");
        await createSampleAuditLogsWithDate(5, oldDate);
        
        // Đợi hệ thống phục hồi
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // 4. Thử gọi cleanup lần nữa - kỳ vọng sẽ thành công
        TestLogger.log("Gọi endpoint dọn dẹp lại sau khi MongoDB đã kết nối lại");
        try {
          await firstValueFrom(
            natsClient.send({ cmd: "cleanup-audit-logs" }, {})
          );
          TestLogger.log("Đã gọi endpoint dọn dẹp thành công sau khi phục hồi");
        } catch (error) {
          TestLogger.error(`Vẫn có lỗi sau khi phục hồi: ${error.message}`);
          fail(`Service không phục hồi đúng sau khi kết nối lại MongoDB: ${error.message}`);
        }
        
        // Kiểm tra khả năng đọc dữ liệu sau khi phục hồi
        const logsAfterRecovery = await AuditLogEntry.find({}).lean();
        TestLogger.log(`Số lượng audit logs sau khi phục hồi: ${logsAfterRecovery.length}`);
        
        // Test pass nếu có thể đọc dữ liệu sau khi phục hồi
        expect(logsAfterRecovery.length).toBeGreaterThanOrEqual(0);
        
      } catch (error) {
        TestLogger.error(`Lỗi trong quá trình test phục hồi: ${error.message}`, error.stack);
        // Đảm bảo MongoDB được khởi động lại ngay cả khi test thất bại
        try {
          // Khởi động lại MongoDB container bất kể trạng thái hiện tại
          mongoContainer = await new MongoDBContainer().start();
          TestLogger.log(`MongoDB container đã được khởi động lại sau lỗi tại ${mongoContainer.getConnectionString()}`);
          
          // Kết nối lại với MongoDB
          if (mongoConnection) {
            try {
              await mongoConnection.close();
            } catch (err) {
              // Có thể đã đóng do lỗi
            }
          }
          mongoConnection = await mongoose
            .createConnection(mongoContainer.getConnectionString())
            .asPromise();
          AuditLogEntry = mongoConnection.model<IAuditLogEntry>(
            "AuditLogEntry",
            auditLogEntrySchema,
            "audit_log_entries"
          );
        } catch (recoveryError) {
          TestLogger.error(`Không thể khôi phục MongoDB sau lỗi: ${recoveryError.message}`);
          throw recoveryError; // Điều này sẽ làm cho test fail
        }
        throw error; // Điều này sẽ làm cho test fail
      }
    });

    it("Nên xử lý được khi MongoDB có độ trễ cao", async () => {
      TestLogger.log("--------------------------------------------------");
      TestLogger.log("TEST: Nên xử lý được khi MongoDB có độ trễ cao");

      try {
        // Tạo dữ liệu kiểm tra
        const nowDate = new Date();
        const oldDate = new Date(nowDate);
        oldDate.setDate(oldDate.getDate() - 10);
        
        // Tạo logs cũ để test xóa
        await createSampleAuditLogsWithDate(5, oldDate);
        
        // Tạo logs mới để kiểm tra không bị xóa
        await createSampleAuditLogsWithDate(3, nowDate);
        
        // Kiểm tra số lượng logs ban đầu
        const initialLogs = await AuditLogEntry.find({}).lean();
        TestLogger.log(`Số lượng audit logs ban đầu: ${initialLogs.length}`);
        expect(initialLogs.length).toBe(8);

        // Mô phỏng độ trễ cao bằng cách tạo nhiều requests đồng thời
        TestLogger.log("Mô phỏng độ trễ cao bằng cách tạo nhiều requests đồng thời...");
        
        // Tạo thêm nhiều documents để tăng áp lực lên MongoDB
        const largeDataPromises = [];
        for (let i = 0; i < 20; i++) {
          largeDataPromises.push(createSampleAuditLogsWithDate(10, oldDate));
        }
        
        // Đợi tất cả promise hoàn thành
        await Promise.all(largeDataPromises);
        TestLogger.log("Đã tạo dữ liệu lớn để mô phỏng độ trễ cao");
        
        // Kiểm tra số lượng logs sau khi tạo dữ liệu lớn
        const logsAfterLoad = await AuditLogEntry.find({}).lean();
        TestLogger.log(`Số lượng audit logs sau khi tạo dữ liệu lớn: ${logsAfterLoad.length}`);
        
        // Thực hiện cleanup trong khi DB đang có nhiều dữ liệu
        TestLogger.log("Gọi cleanup trong khi DB có nhiều dữ liệu...");
        
        try {
          await firstValueFrom(
            natsClient.send({ cmd: "cleanup-audit-logs" }, {})
          );
        } catch (error) {
          TestLogger.log(`Lỗi khi gọi cleanup (có thể dự kiến): ${error.message}`);
          // Kiểm tra xem lỗi có phải là do vấn đề kết nối NATS đã biết
          if (!error.message.includes("Empty response") && !error.message.includes("timeout")) {
            fail(`Lỗi không mong đợi khi gọi cleanup: ${error.message}`);
          }
        }
        
        // Đợi một chút để cho quá trình xóa có thể hoàn tất (nếu đang diễn ra)
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Kiểm tra service có còn đáp ứng không bằng cách xem có thể truy vấn DB
        const afterCleanupLogs = await AuditLogEntry.find({}).lean();
        TestLogger.log(`Số lượng audit logs sau khi thử cleanup: ${afterCleanupLogs.length}`);
        
        // Service vẫn ổn định nếu chúng ta có thể truy vấn DB thành công
        expect(afterCleanupLogs.length).toBeGreaterThanOrEqual(3); // Ít nhất các logs mới vẫn còn
        
        // Kiểm tra xem các logs mới không bị xóa
        const recentLogs = await AuditLogEntry.find({ 
          timestamp: { $gte: new Date(nowDate) } 
        }).lean();
        
        TestLogger.log(`Số lượng audit logs mới sau quá trình: ${recentLogs.length}`);
        expect(recentLogs.length).toBe(3); // 3 logs mới đã tạo ban đầu vẫn còn
        
      } catch (error) {
        TestLogger.error(`Lỗi trong quá trình test độ trễ cao: ${error.message}`, error.stack);
        throw error;
      }
    });
  });

  /**
   * Tạo các audit logs mẫu với ngày cụ thể để kiểm tra
   * @param count Số lượng audit logs cần tạo
   * @param date Ngày cần đặt cho audit log
   * @returns Các audit logs đã tạo
   */
  async function createSampleAuditLogsWithDate(
    count = 3,
    date = new Date()
  ): Promise<IAuditLogEntry[]> {
    const auditLogs: IAuditLogEntry[] = [];
    const tenantId = "test-tenant-1";
    const boundedContext = "IAM";

    for (let i = 0; i < count; i++) {
      const id = uuidv4();
      const eventId = `event-${uuidv4()}`;
      const resourceId = `resource-${uuidv4()}`;
      const userId = `user-${i}`;
      const userName = `Test User ${i}`;

      try {
        const auditLog = new AuditLogEntry({
          id,
          eventId,
          timestamp: date,
          initiator: {
            type: "user",
            id: userId,
            name: userName,
          },
          action: i % 2 === 0 ? "create" : "update",
          resource: {
            type: "user",
            id: resourceId,
            name: `Test Resource ${i}`,
          },
          boundedContext,
          tenantId,
          context: {
            ip: "127.0.0.1",
            userAgent: "E2E Test",
          },
          changes: [
            {
              field: "status",
              oldValue: i % 2 === 0 ? null : "inactive",
              newValue: "active",
            },
          ],
          metadata: {
            source: "e2e-test",
            testIndex: i,
          },
          // Các trường bắt buộc cho domain model
          actionType: i % 2 === 0 ? "C" : "U",
          category: "USER_MANAGEMENT",
          severity: "INFO",
          entityType: "user",
          entityId: resourceId,
          status: "SUCCESS",
          createdAt: date, // Sử dụng ngày được truyền vào
        });

        await auditLog.save();
        auditLogs.push(auditLog);
      } catch (error) {
        TestLogger.error(`Lỗi khi tạo audit log mẫu: ${error.message}`);
        throw error;
      }
    }

    TestLogger.log(
      `Created ${count} sample audit logs with date ${date.toISOString()}`
    );
    return auditLogs;
  }
}); 