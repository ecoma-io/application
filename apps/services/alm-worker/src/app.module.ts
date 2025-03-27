/**
 * @fileoverview Module gốc cho ALM Worker Service
 * @description Module này chịu trách nhiệm cấu hình và khởi tạo các thành phần cốt lõi của service,
 * bao gồm cấu hình ứng dụng, kết nối cơ sở dữ liệu, health check và các tác vụ định kỳ.
 * @since 1.0.0
 */

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import joi from "joi";

import { HealthModule } from "@ecoma/nestjs-health";

/**
 * Module gốc của ALM Worker Service
 * @description Module này cung cấp các cấu hình cần thiết cho:
 * - Validation và quản lý biến môi trường
 * - Kết nối MongoDB
 * - Health check endpoints
 * - Scheduled tasks
 */
@Module({
  imports: [
    // Cấu hình ứng dụng
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        NODE_ENV: joi
          .string()
          .valid("development", "production", "test")
          .default("development"),

        PORT: joi.number().default(3000),

        MONGODB_URI: joi.string().required(),

        NATS_URL: joi.string().required(),

        RABBITMQ_URI: joi.string().required(),

        ALM_RABBITMQ_EXCHANGE_NAME: joi.string().default("alm.events"),

        ALM_RABBITMQ_EXCHANGE_TYPE: joi.string().default("topic"),

        RETENTION_DAYS: joi.number().default(90), // Số ngày giữ lại audit logs
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),

    // Health check module
    HealthModule.register({
      mongoEnabled: true,
      natsEnabled: true,
      rabbitmqEnabled: false,
    }),

    // Kết nối MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),

    // Scheduled tasks
    ScheduleModule.forRoot(),
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
