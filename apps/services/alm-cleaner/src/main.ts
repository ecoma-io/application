/**
 * @fileoverview Điểm khởi chạy của ALM Cleaner Service
 * @since 1.0.0
 */

import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { NestjsLogger } from "@ecoma/nestjs-logging";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Tạo logger với context là "Bootstrap"
  const logger = new NestjsLogger("Bootstrap");

  try {
    // Log thông tin khởi động với timestamp
    const startTime = Date.now();
    logger.info("Starting ALM Cleaner Service", {
      timestamp: new Date().toISOString(),
      pid: process.pid,
      nodeEnv: process.env["NODE_ENV"]
    });

    // Debug thông tin môi trường
    logger.debug("Environment information", {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memoryUsage: process.memoryUsage()
    });

    // Tạo ứng dụng HTTP thông thường với logger tùy chỉnh
    logger.debug("Initializing NestJS application...");
    const app = await NestFactory.create(AppModule, { logger });
    logger.debug("NestJS application initialized successfully");

    // Lấy ConfigService
    const configService = app.get(ConfigService);
    logger.debug("ConfigService retrieved successfully");

    // Lấy các cấu hình từ ConfigService
    const natsUrl = configService.get<string>("NATS_URL");
    const port = configService.get<number>("PORT");
    const mongodbUri = configService.get<string>("MONGODB_URI");
    const rabbitmqUri = configService.get<string>("RABBITMQ_URI");

    logger.debug("Configuration loaded", {
      port,
      natsUrl,
      mongodbUri: mongodbUri ? `${mongodbUri.split("@")[0].split("//")[0]}//***:***@${mongodbUri.split("@")[1]}` : undefined,
      rabbitmqUri: rabbitmqUri ? `${rabbitmqUri.split("@")[0].split("//")[0]}//***:***@${rabbitmqUri.split("@")[1]}` : undefined,
    });

    // Tạo kết nối microservice với NATS
    logger.debug("Configuring NATS microservice...");
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [natsUrl],
        queue: "alm-cleaner", // Queue group cho load balancing giữa các instance của alm-cleaner
      },
    });
    logger.debug("NATS microservice configured successfully");



    // Khởi động microservice
    logger.debug("Starting microservice...");
    await app.startAllMicroservices();
    logger.info("Microservice started successfully", { transport: "NATS", servers: [natsUrl] });

    // Khởi động HTTP server (nếu cần)
    logger.debug("Starting HTTP server...");
    await app.listen(port);
    logger.info("HTTP server started successfully", { port });

    // Tính toán thời gian khởi động
    const endTime = Date.now();
    const startupTime = endTime - startTime;

    logger.info("ALM Cleaner Service started successfully", {
      startupTimeMs: startupTime,
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage()
    });
  } catch (error) {
    logger.error({
      msg: "Error starting ALM Cleaner Service",
      err: error,
    });

    // Đảm bảo process exit với lỗi để container orchestrator (như Kubernetes) có thể restart service
    process.exit(1);
  }
}

// Xử lý các lỗi không bắt được để đảm bảo chúng được ghi lại
process.on("uncaughtException", (error) => {
  // Tạo logger mới vì có thể logger ban đầu chưa được khởi tạo hoặc đã bị hủy
  const emergencyLogger = new NestjsLogger("UNCAUGHT_EXCEPTION");
  emergencyLogger.fatal({ msg: "Uncaught exception", err: error });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  // Tạo logger mới vì có thể logger ban đầu chưa được khởi tạo hoặc đã bị hủy
  const emergencyLogger = new NestjsLogger("UNHANDLED_REJECTION");
  emergencyLogger.error({ msg: "Uncaught exception", err: reason instanceof Error ? reason : new Error(String(reason)), promise: typeof promise === "object" ? JSON.stringify(promise) : String(promise) });
});

bootstrap();
