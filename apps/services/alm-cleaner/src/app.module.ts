/**
 * @fileoverview Module gốc cho ALM Cleaner Service
 * @since 1.0.0
 */

import { AlmInfrastructureModule } from "@ecoma/alm-infrastructure";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import joi from "joi";
import { EventsModule } from "./events/events.module";
import { HealthModule } from "@ecoma/nestjs-health";

@Module({
  imports: [
    // Cấu hình ứng dụng
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NODE_ENV: joi
          .string()
          .valid("development", "production", "test")
          .default("development"),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PORT: joi.number().default(3000),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MONGODB_URI: joi.string().required(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NATS_URL: joi.string().required(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        RABBITMQ_URI: joi.string().required(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ALM_RABBITMQ_EXCHANGE_NAME: joi.string().default("alm.events"),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ALM_RABBITMQ_EXCHANGE_TYPE: joi.string().default("topic"),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        RETENTION_DAYS: joi.number().default(90), // Số ngày giữ lại audit logs
      }),
      validationOptions: {
        abortEarly: true,
      },
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

    // Import ALM Infrastructure module với cấu hình từ ConfigService
    AlmInfrastructureModule.registerAsync(),

    // Module xử lý events
    EventsModule,

    // Health check module
    HealthModule.register({
      mongoEnabled: true,
      natsEnabled: true,
      rabbitmqEnabled: false,
    }),
  ],
})
export class AppModule {} 