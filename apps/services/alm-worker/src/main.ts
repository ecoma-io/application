/**
 * @fileoverview Entry point của ALM Ingestion Service
 * @description Khởi tạo và cấu hình NestJS application
 * @since 1.0.0
 */

import { NestjsLogger } from "@ecoma/common-infrastructure";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new NestjsLogger("Bootstrap");

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port");
  const env = configService.get<string>("app.env");
  const logLevel = configService.get<string>("app.logging.level");
  const logFormat = configService.get<string>("app.logging.format");
  const debug = configService.get<boolean>("app.debug");
  const natsUrl = configService.get<string>("app.nats.url");

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [natsUrl],
      queue: "alm-query", // Queue group for load balancing between alm-query instances
    },
  });

  // In cách cấu hình cơ bản của service
  logger.log(`Environment: ${env}`);
  logger.log(`Log Level: ${logLevel}`);
  logger.log(`Log Format: ${logFormat}`);
  logger.log(`Debug Mode: ${debug}`);

  // Khởi động các microservices
  await app.startAllMicroservices();

  // Khởi động ứng dụng
  await app.listen(port);
  logger.log(`ALM Query Worker is running on port ${port}`);
}

bootstrap();
