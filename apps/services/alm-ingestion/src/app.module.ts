/**
 * @fileoverview Module gốc của ALM Ingestion Service
 * @description Module này chịu trách nhiệm cấu hình và khởi tạo các thành phần cốt lõi của service,
 * bao gồm cấu hình ứng dụng, kết nối cơ sở dữ liệu, health check và kết nối message broker.
 * @since 1.0.0
 */
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { HealthModule } from "@ecoma/nestjs-health";
import { NestjsLoggerModule } from "@ecoma/nestjs-logging";

import appConfig, { appConfigValidationSchema } from "./config/app.config";
import { IngestionModule } from "./modules/ingestion/ingestion.module";

/**
 * Module gốc của ALM Ingestion Service
 * @description Module này cung cấp các cấu hình cần thiết cho:
 * - Validation và quản lý biến môi trường
 * - Kết nối MongoDB
 * - Health check endpoints
 * - Xử lý các sự kiện từ RabbitMQ
 */
@Module({
  imports: [
    // Cấu hình ứng dụng
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: appConfigValidationSchema,
    }),

    // Logger
    NestjsLoggerModule.register({
      defaultContext: "ALM-Ingestion",
      isGlobal: true,
    }),

    // Kết nối MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("app.mongodb.uri"),
        dbName: "audit-logs",
      }),
    }),

    // Health check
    HealthModule.register({
      mongoEnabled: true,
      natsEnabled: true,
      rabbitmqEnabled: true,
    }),

    // Module xử lý audit log events
    IngestionModule,
  ],
})
export class AppModule {}
