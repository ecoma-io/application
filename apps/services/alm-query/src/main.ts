/**
 * @fileoverview Điểm khởi chạy của ALM Query Service
 * @since 1.0.0
 */

import { NestjsLogger } from "@ecoma/nestjs-logging";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new NestjsLogger("Bootstrap");

  logger.log("Khởi động ALM Query Service");

  // Tạo hybrid application (microservice + HTTP)
  const app = await NestFactory.create(AppModule, { logger });

  // Lấy ConfigService
  const configService = app.get(ConfigService);

  // Lấy các cấu hình từ ConfigService
  const natsUrl = configService.get<string>("NATS_URL");
  const port = configService.get<number>("PORT");

  // Cấu hình global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // Cấu hình CORS cho HTTP interface
  app.enableCors({
    origin: true, // Cho phép tất cả các origin, có thể tùy chỉnh sau
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Prefix cho HTTP API (cho tương thích với các test hiện tại)
  app.setGlobalPrefix("api/v1");

  // Tạo kết nối microservice với NATS (preferred communication method)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [natsUrl],
      queue: "alm-query", // Queue group cho load balancing giữa các instance của alm-query
    },
  });

  // Khởi động microservice TRƯỚC
  await app.startAllMicroservices();

  // Khởi động HTTP server
  await app.listen(port);

  logger.log(`Successfully started ALM Query Service`);
}

bootstrap();
