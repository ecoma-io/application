/**
 * @fileoverview Module gốc của ALM Query Service
 * @description Module này chịu trách nhiệm cấu hình và khởi tạo các thành phần cốt lõi của service,
 * bao gồm cấu hình ứng dụng, kết nối cơ sở dữ liệu, health check và kết nối đến các service khác.
 * @since 1.0.0
 */

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";

import { HealthModule } from "@ecoma/nestjs-health";
import { NestjsLoggerModule } from "@ecoma/nestjs-logging";

import appConfig, { appConfigValidationSchema } from "./config/app.config";
import { AuditLogModule } from "./modules/audit-log/audit-log.module";

/**
 * Module gốc của ALM Query Service
 * @description Module này cung cấp các cấu hình cần thiết cho:
 * - Validation và quản lý biến môi trường
 * - Kết nối MongoDB
 * - Kết nối NATS để giao tiếp với IAM service
 * - Health check endpoints
 */
@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: appConfigValidationSchema,
    }),

    // Logger
    NestjsLoggerModule.register({
      defaultContext: "ALM-Query",
      isGlobal: true,
    }),

    // Health check
    HealthModule.register({
      mongoEnabled: true,
      natsEnabled: true,
    }),

    // Database
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("app.mongodb.uri"),
      }),
      inject: [ConfigService],
    }),

    // NATS Client
    ClientsModule.registerAsync([
      {
        name: "NATS_CLIENT",
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get<string>("app.nats.url")],
          },
        }),
        inject: [ConfigService],
      },
    ]),

    // CQRS
    CqrsModule,

    // Feature Modules
    AuditLogModule,
  ],
})
export class AppModule {}
