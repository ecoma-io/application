import "reflect-metadata";

/**
 * @fileoverview Entry point của ALM Ingestion Service
 * @description Khởi tạo và cấu hình NestJS application
 * @since 1.0.0
 */

import { AbstractLogger } from "@ecoma/common-application";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  MicroserviceOptions,
  NatsOptions,
  Transport,
} from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(AbstractLogger);

  logger.setContext("ALM Worker Bootstrap");

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Connect NATS microservice
  const natsConfig: NatsOptions = {
    transport: Transport.NATS,
    options: {
      servers: [configService.get<string>("app.nats.url")],
      queue: configService.get<string>("app.nats.queue"),
      timeout: 5000, // Tăng timeout lên 5s
    },
  };

  // Hybrid application (HTTP + Microservice)
  app.connectMicroservice<MicroserviceOptions>(natsConfig);

  // Start all microservices
  await app.startAllMicroservices();

  const port = configService.get<number>("app.port");
  await app.listen(port);

  logger.info(`ALM Worker is running on port ${port}`);
}

bootstrap();
