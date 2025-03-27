/**
 * @fileoverview Module gốc cho ALM Worker Service
 * @description Module này chịu trách nhiệm cấu hình và khởi tạo các thành phần cốt lõi của service,
 * bao gồm cấu hình ứng dụng, kết nối cơ sở dữ liệu, health check và các tác vụ định kỳ.
 * @since 1.0.0
 */

import {
  AlmWorkerApplicationService,
  DeleteAuditLogsUseCase,
  ProcessRetentionPoliciesUseCase,
} from "@ecoma/alm-application";
import {
  AuditLogEntryDocument,
  AuditLogEntrySchema,
  AuditLogReadRepository,
  AuditLogWriteRepository,
  MongoDistributedLockService,
  RabbitMQQueueService,
  RetentionPolicyDocument,
  RetentionPolicyReadRepository,
  RetentionPolicySchema,
  WorkerLockDocument,
  WorkerLockSchema,
} from "@ecoma/alm-infrastructure";
import { AbstractLogger } from "@ecoma/common-application";
import { AppLogger, HealthModule } from "@ecoma/common-infrastructure";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import configuration, { appConfigValidationSchema } from "./app.config";
import { AppController } from "./app.controller";
import { AuditLogDeletionConsumer } from "./consumers/audit-log-deletion.consumer";
import { RetentionPolicyScheduler } from "./schedulers/retention-policy.scheduler";

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
      load: [configuration],
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
      { name: WorkerLockDocument.name, schema: WorkerLockSchema },
    ]),

    // Schedule Module
    ScheduleModule.forRoot(),

    // RabbitMQ
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("app.rabbitmq.url"),
        exchanges: [
          {
            name: "alm.events",
            type: "topic",
          },
        ],
        enableControllerDiscovery: true,
        connectionInitOptions: { wait: false },
      }),
    }),

    // NATS Client
    ClientsModule.registerAsync([
      {
        name: "NATS_CLIENT",
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get<string>("app.nats.url")],
            queue: configService.get<string>("app.nats.queue"),
          },
        }),
      },
    ]),

    // Health check
    HealthModule.register({
      mongoEnabled: true,
      natsEnabled: true,
      rabbitmqEnabled: true,
    }),
  ],
  providers: [
    // Cung cấp Logger
    {
      provide: AbstractLogger,
      useClass: AppLogger,
    },

    // Distributed Lock Service
    {
      provide: "IDistributedLockService",
      useClass: MongoDistributedLockService,
    },

    // Queue Service
    {
      provide: "IQueueService",
      useClass: RabbitMQQueueService,
    },

    // Repositories
    {
      provide: "IAuditLogReadRepository",
      useClass: AuditLogReadRepository,
    },
    {
      provide: "IAuditLogWriteRepository",
      useClass: AuditLogWriteRepository,
    },
    {
      provide: "IRetentionPolicyReadRepository",
      useClass: RetentionPolicyReadRepository,
    },

    // Use Cases
    {
      provide: ProcessRetentionPoliciesUseCase,
      inject: [
        "IRetentionPolicyReadRepository",
        "IAuditLogReadRepository",
        "IQueueService",
        AbstractLogger,
      ],
      useFactory: (retentionPolicyRepo, auditLogRepo, queueService, logger) => {
        return new ProcessRetentionPoliciesUseCase(
          retentionPolicyRepo,
          auditLogRepo,
          queueService,
          logger
        );
      },
    },
    {
      provide: DeleteAuditLogsUseCase,
      inject: ["IAuditLogWriteRepository", AbstractLogger],
      useFactory: (auditLogRepo, logger) => {
        return new DeleteAuditLogsUseCase(auditLogRepo, logger);
      },
    },

    // Application Service
    {
      provide: AlmWorkerApplicationService,
      inject: [ProcessRetentionPoliciesUseCase, DeleteAuditLogsUseCase],
      useFactory: (processUseCase, deleteUseCase) => {
        return new AlmWorkerApplicationService(processUseCase, deleteUseCase);
      },
    },

    // Schedulers
    RetentionPolicyScheduler,

    // Consumers
    AuditLogDeletionConsumer,
  ],
  controllers: [AppController],
  exports: [],
})
export class AppModule {}
