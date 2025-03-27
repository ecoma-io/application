/**
 * @fileoverview Entry point của ALM Ingestion Service
 * @description Khởi tạo và cấu hình NestJS application
 * @since 1.0.0
 */

import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port");
  const env = configService.get<string>("app.env");
  const logLevel = configService.get<string>("app.logging.level");
  const logFormat = configService.get<string>("app.logging.format");
  const debug = configService.get<boolean>("app.debug");

  // Cấu hình logging
  const logger = new Logger("ALM-Ingestion");
  logger.log(`Environment: ${env}`);
  logger.log(`Log Level: ${logLevel}`);
  logger.log(`Log Format: ${logFormat}`);
  logger.log(`Debug Mode: ${debug}`);

  // Khởi động ứng dụng
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}

bootstrap();
