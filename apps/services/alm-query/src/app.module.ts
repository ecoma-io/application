/**
 * @fileoverview Module gốc của ALM Query Service
 * @description Module này chịu trách nhiệm cấu hình và khởi tạo các thành phần cốt lõi của service,
 * bao gồm cấu hình ứng dụng, kết nối cơ sở dữ liệu, health check và kết nối message broker.
 * @since 1.0.0
 */
import {
  AlmQueryApplicationService,
  GetAuditLogsQueryHandler,
  GetRetentionPoliciesQueryHandler,
} from "@ecoma/alm-application";
import {
  AuditLogEntryDocument,
  AuditLogEntrySchema,
  AuditLogReadRepository,
  RetentionPolicyDocument,
  RetentionPolicyReadRepository,
  RetentionPolicySchema,
} from "@ecoma/alm-infrastructure";
import { AbstractLogger } from "@ecoma/common-application";
import { AppLogger, HealthModule } from "@ecoma/common-infrastructure";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import appConfig, { appConfigValidationSchema } from "./app.config";
import { AppController } from "./app.controller";

// Define tokens for dependency injection
const AUDIT_LOG_READ_REPOSITORY = "AUDIT_LOG_READ_REPOSITORY";
const RETENTION_POLICY_READ_REPOSITORY = "RETENTION_POLICY_READ_REPOSITORY";

/**
 * Module gốc của ALM Query Service
 * @description Module này cung cấp các cấu hình cần thiết cho:
 * - Validation và quản lý biến môi trường
 * - Kết nối MongoDB
 * - Health check endpoints
 * - Xử lý các sự kiện từ NATS
 */
@Module({
  imports: [
    // Cấu hình ứng dụng
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: appConfigValidationSchema,
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

    // Đăng ký schema Mongoose
    MongooseModule.forFeature([
      { name: AuditLogEntryDocument.name, schema: AuditLogEntrySchema },
      { name: RetentionPolicyDocument.name, schema: RetentionPolicySchema },
    ]),

    // Health check
    HealthModule.register({
      mongoEnabled: true,
      natsEnabled: true,
    }),
  ],
  providers: [
    {
      provide: AbstractLogger,
      useClass: AppLogger,
    },
    // Repositories
    {
      provide: AUDIT_LOG_READ_REPOSITORY,
      useClass: AuditLogReadRepository,
    },
    {
      provide: RETENTION_POLICY_READ_REPOSITORY,
      useClass: RetentionPolicyReadRepository,
    },

    // Query handlers
    {
      provide: GetAuditLogsQueryHandler,
      useFactory: (auditLogReadRepo, logger) => {
        return new GetAuditLogsQueryHandler(auditLogReadRepo, logger);
      },
      inject: [AUDIT_LOG_READ_REPOSITORY, AbstractLogger],
    },
    {
      provide: GetRetentionPoliciesQueryHandler,
      useFactory: (retentionPolicyReadRepo, logger) => {
        return new GetRetentionPoliciesQueryHandler(
          retentionPolicyReadRepo,
          logger
        );
      },
      inject: [RETENTION_POLICY_READ_REPOSITORY, AbstractLogger],
    },

    // Application services
    {
      provide: AlmQueryApplicationService,
      useFactory: (
        getAuditLogsQueryHandler: GetAuditLogsQueryHandler,
        getRetentionPoliciesQueryHandler: GetRetentionPoliciesQueryHandler
      ) => {
        return new AlmQueryApplicationService(
          getAuditLogsQueryHandler,
          getRetentionPoliciesQueryHandler
        );
      },
      inject: [GetAuditLogsQueryHandler, GetRetentionPoliciesQueryHandler],
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
