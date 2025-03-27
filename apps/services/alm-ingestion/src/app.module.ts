/**
 * @fileoverview Module gốc của ALM Ingestion Service
 * @description Module này chịu trách nhiệm cấu hình và khởi tạo các thành phần cốt lõi của service,
 * bao gồm cấu hình ứng dụng, kết nối cơ sở dữ liệu, health check và kết nối message broker.
 * @since 1.0.0
 */
import {
  ActivateRetentionPolicyCommandHandler,
  AlmIngestionApplicationService,
  AuditLogEntryFactory,
  CreateRetentionPolicyCommandHandler,
  DeactivateRetentionPolicyCommandHandler,
  DeleteRetentionPolicyCommandHandler,
  IngestAuditLogCommandHandler,
  RetentionPolicyFactory,
  UpdateRetentionPolicyCommandHandler,
} from "@ecoma/alm-application";
import {
  AuditLogEntryDocument,
  AuditLogEntrySchema,
  AuditLogWriteRepository,
  RetentionPolicyDocument,
  RetentionPolicyReadRepository,
  RetentionPolicySchema,
  RetentionPolicyWriteRepository,
  UuidIdFactory,
} from "@ecoma/alm-infrastructure";
import { AbstractLogger } from "@ecoma/common-application";
import { AppLogger, HealthModule } from "@ecoma/common-infrastructure";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import appConfig, { appConfigValidationSchema } from "./app.config";
import { AppController } from "./app.controller";

// Define tokens for dependency injection
const AUDIT_LOG_WRITE_REPOSITORY = "AUDIT_LOG_WRITE_REPOSITORY";
const RETENTION_POLICY_WRITE_REPOSITORY = "RETENTION_POLICY_WRITE_REPOSITORY";
const RETENTION_POLICY_READ_REPOSITORY = "RETENTION_POLICY_READ_REPOSITORY";
const UUID_ID_FACTORY = "UUID_ID_FACTORY";

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
      provide: AUDIT_LOG_WRITE_REPOSITORY,
      useClass: AuditLogWriteRepository,
    },
    {
      provide: RETENTION_POLICY_WRITE_REPOSITORY,
      useClass: RetentionPolicyWriteRepository,
    },
    {
      provide: RETENTION_POLICY_READ_REPOSITORY,
      useClass: RetentionPolicyReadRepository,
    },

    // Factories
    {
      provide: UUID_ID_FACTORY,
      useClass: UuidIdFactory,
    },
    {
      provide: AuditLogEntryFactory,
      useFactory: (uuidIdFactory) => {
        return new AuditLogEntryFactory(uuidIdFactory);
      },
      inject: [UUID_ID_FACTORY],
    },
    {
      provide: RetentionPolicyFactory,
      useFactory: (uuidIdFactory) => {
        return new RetentionPolicyFactory(uuidIdFactory);
      },
      inject: [UUID_ID_FACTORY],
    },

    // Command handlers
    {
      provide: IngestAuditLogCommandHandler,
      useFactory: (auditLogWriteRepo, auditLogEntryFactory, logger) => {
        return new IngestAuditLogCommandHandler(
          auditLogWriteRepo,
          auditLogEntryFactory,
          logger
        );
      },
      inject: [
        AUDIT_LOG_WRITE_REPOSITORY,
        AuditLogEntryFactory,
        AbstractLogger,
      ],
    },
    {
      provide: CreateRetentionPolicyCommandHandler,
      useFactory: (retentionPolicyRepo, retentionPolicyFactory, logger) => {
        return new CreateRetentionPolicyCommandHandler(
          retentionPolicyRepo,
          retentionPolicyFactory,
          logger
        );
      },
      inject: [
        RETENTION_POLICY_WRITE_REPOSITORY,
        RetentionPolicyFactory,
        AbstractLogger,
      ],
    },
    {
      provide: UpdateRetentionPolicyCommandHandler,
      useFactory: (
        retentionPolicyReadRepo,
        retentionPolicyWriteRepo,
        retentionPolicyFactory,
        logger
      ) => {
        return new UpdateRetentionPolicyCommandHandler(
          retentionPolicyReadRepo,
          retentionPolicyWriteRepo,
          retentionPolicyFactory,
          logger
        );
      },
      inject: [
        RETENTION_POLICY_READ_REPOSITORY,
        RETENTION_POLICY_WRITE_REPOSITORY,
        RetentionPolicyFactory,
        AbstractLogger,
      ],
    },
    {
      provide: DeleteRetentionPolicyCommandHandler,
      useFactory: (
        retentionPolicyReadRepo,
        retentionPolicyWriteRepo,
        logger
      ) => {
        return new DeleteRetentionPolicyCommandHandler(
          retentionPolicyReadRepo,
          retentionPolicyWriteRepo,
          logger
        );
      },
      inject: [
        RETENTION_POLICY_READ_REPOSITORY,
        RETENTION_POLICY_WRITE_REPOSITORY,
        AbstractLogger,
      ],
    },
    {
      provide: ActivateRetentionPolicyCommandHandler,
      useFactory: (
        retentionPolicyReadRepo,
        retentionPolicyWriteRepo,
        logger
      ) => {
        return new ActivateRetentionPolicyCommandHandler(
          retentionPolicyReadRepo,
          retentionPolicyWriteRepo,
          logger
        );
      },
      inject: [
        RETENTION_POLICY_READ_REPOSITORY,
        RETENTION_POLICY_WRITE_REPOSITORY,
        AbstractLogger,
      ],
    },
    {
      provide: DeactivateRetentionPolicyCommandHandler,
      useFactory: (
        retentionPolicyReadRepo,
        retentionPolicyWriteRepo,
        logger
      ) => {
        return new DeactivateRetentionPolicyCommandHandler(
          retentionPolicyReadRepo,
          retentionPolicyWriteRepo,
          logger
        );
      },
      inject: [
        RETENTION_POLICY_READ_REPOSITORY,
        RETENTION_POLICY_WRITE_REPOSITORY,
        AbstractLogger,
      ],
    },

    // Application services
    {
      provide: AlmIngestionApplicationService,
      useFactory: (
        ingestAuditLogCommandHandler: IngestAuditLogCommandHandler,
        createRetentionPolicyCommandHandler: CreateRetentionPolicyCommandHandler,
        updateRetentionPolicyCommandHandler: UpdateRetentionPolicyCommandHandler,
        deleteRetentionPolicyCommandHandler: DeleteRetentionPolicyCommandHandler,
        activateRetentionPolicyCommandHandler: ActivateRetentionPolicyCommandHandler,
        deactivateRetentionPolicyCommandHandler: DeactivateRetentionPolicyCommandHandler
      ) => {
        return new AlmIngestionApplicationService(
          ingestAuditLogCommandHandler,
          createRetentionPolicyCommandHandler,
          deleteRetentionPolicyCommandHandler,
          updateRetentionPolicyCommandHandler,
          activateRetentionPolicyCommandHandler,
          deactivateRetentionPolicyCommandHandler
        );
      },
      inject: [
        IngestAuditLogCommandHandler,
        CreateRetentionPolicyCommandHandler,
        UpdateRetentionPolicyCommandHandler,
        DeleteRetentionPolicyCommandHandler,
        ActivateRetentionPolicyCommandHandler,
        DeactivateRetentionPolicyCommandHandler,
      ],
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
