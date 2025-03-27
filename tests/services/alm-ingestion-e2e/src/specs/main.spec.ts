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
import mongoose, { Document } from "mongoose";
import { GenericContainer, StartedTestContainer } from "testcontainers";

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
});

describe("ALM Ingestion E2E Tests", () => {
  let mongoContainer: StartedMongoDBContainer;
  let natsContainer: StartedNatsContainer;
  let rabbitmqContainer: StartedRabbitMQContainer;
  let almIngestionContainer: StartedTestContainer;
  let mongoConnection: mongoose.Connection;
  let AuditLogEntry: mongoose.Model<IAuditLogEntry>;
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        LOG_LEVEL: "trace",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        LOG_FORMAT: "text",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MONGODB_URI: mongoContainer.getConnectionString(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NATS_URL: "nats://" + natsContainer.getConnectionServer(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        RABBITMQ_URI: rabbitmqContainer.getAmqpUrl(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ALM_RABBITMQ_EXCHANGE_NAME: exchangeName,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ALM_RABBITMQ_EXCHANGE_TYPE: exchangeType,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PORT: "3000",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NODE_ENV: "test",
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
      .createConnection(mongoContainer.getConnectionString())
      .asPromise();
    AuditLogEntry = mongoConnection.model<IAuditLogEntry>(
      "AuditLogEntry",
      auditLogEntrySchema,
      "audit_log_entries"
    );
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
    await AuditLogEntry.deleteMany({});
  });

  // Test case: Kiểm tra health endpoint
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
