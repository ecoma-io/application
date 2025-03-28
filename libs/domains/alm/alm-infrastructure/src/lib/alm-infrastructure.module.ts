/**
 * @fileoverview Module infrastructure cho ALM
 * @since 1.0.0
 */

import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";

import { RabbitMQDomainEventPublisher } from "./message-broker/rabbitmq/domain-event.publisher";
import { PersistAuditLogNatsHandler } from "./nats-rpc/inbound/command-handlers/persist-audit-log.handler";
import { GetAuditLogsNatsHandler } from "./nats-rpc/inbound/query-handlers/get-audit-logs.handler";
import {
  AuditLogEntryEntity,
  AuditLogEntrySchema,
} from "./persistence/mongodb/entities/audit-log-entry.entity";
import { AuditLogMongoRepository } from "./persistence/mongodb/repositories/audit-log.repository";
import { ALM_TOKENS } from "./tokens";

/**
 * Cấu hình cho ALM Infrastructure Module
 */
export interface IAlmInfrastructureModuleOptions {
  /**
   * Cấu hình MongoDB
   */
  mongodb?: {
    /**
     * URI kết nối MongoDB
     */
    uri?: string;
  };

  /**
   * Cấu hình RabbitMQ
   */
  rabbitmq?: {
    /**
     * URI kết nối RabbitMQ
     */
    uri?: string;
    /**
     * Tên exchange
     */
    exchangeName?: string;
    /**
     * Loại exchange
     */
    exchangeType?: string;
  };

  /**
   * Cấu hình NATS
   */
  nats?: {
    /**
     * Bật/tắt handlers NATS
     */
    enableHandlers?: boolean;
  };
}

/**
 * Module infrastructure cho ALM
 */
@Module({})
export class AlmInfrastructureModule {
  /**
   * Đăng ký module với cấu hình tĩnh
   * @param options - Cấu hình cho module
   */
  static register(options: IAlmInfrastructureModuleOptions): DynamicModule {
    return {
      module: AlmInfrastructureModule,
      imports: [
        CqrsModule,
        MongooseModule.forFeature([
          {
            name: AuditLogEntryEntity.name,
            schema: AuditLogEntrySchema,
            collection: "audit_log_entries",
          },
        ]),
        options.rabbitmq
          ? RabbitMQModule.forRoot({
              exchanges: [
                {
                  name: options.rabbitmq.exchangeName || "alm.events",
                  type: options.rabbitmq.exchangeType || "topic",
                },
              ],
              uri: options.rabbitmq.uri || "amqp://localhost:5672",
            })
          : RabbitMQModule.forRoot({
              exchanges: [
                {
                  name: "alm.events",
                  type: "topic",
                },
              ],
              uri: "amqp://localhost:5672",
            }),
      ],
      providers: [
        // Repositories
        {
          provide: ALM_TOKENS.auditLogReadRepository,
          useClass: AuditLogMongoRepository,
        },
        {
          provide: ALM_TOKENS.auditLogWriteRepository,
          useClass: AuditLogMongoRepository,
        },
        // Event Publisher
        {
          provide: ALM_TOKENS.domainEventPublisher,
          useClass: RabbitMQDomainEventPublisher,
        },
        // NATS Handlers (có thể bật/tắt)
        ...(options.nats?.enableHandlers !== false
          ? [PersistAuditLogNatsHandler, GetAuditLogsNatsHandler]
          : []),
      ],
      exports: [
        ALM_TOKENS.auditLogReadRepository,
        ALM_TOKENS.auditLogWriteRepository,
        ALM_TOKENS.domainEventPublisher,
      ],
    };
  }

  /**
   * Đăng ký module với cấu hình từ ConfigService
   */
  static registerAsync(): DynamicModule {
    return {
      module: AlmInfrastructureModule,
      imports: [
        CqrsModule,
        MongooseModule.forFeature([
          {
            name: AuditLogEntryEntity.name,
            schema: AuditLogEntrySchema,
            collection: "audit_log_entries",
          },
        ]),
        RabbitMQModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            exchanges: [
              {
                name: configService.get<string>(
                  "ALM_RABBITMQ_EXCHANGE_NAME",
                  "alm.events"
                ),
                type: configService.get<string>(
                  "ALM_RABBITMQ_EXCHANGE_TYPE",
                  "topic"
                ),
              },
            ],
            uri: configService.get<string>(
              "RABBITMQ_URI",
              "amqp://localhost:5672"
            ),
          }),
        }),
      ],
      providers: [
        // Repositories
        {
          provide: ALM_TOKENS.auditLogReadRepository,
          useClass: AuditLogMongoRepository,
        },
        {
          provide: ALM_TOKENS.auditLogWriteRepository,
          useClass: AuditLogMongoRepository,
        },
        // Event Publisher
        {
          provide: ALM_TOKENS.domainEventPublisher,
          useClass: RabbitMQDomainEventPublisher,
        },
        // NATS Handlers
        PersistAuditLogNatsHandler,
        GetAuditLogsNatsHandler,
      ],
      exports: [
        ALM_TOKENS.auditLogReadRepository,
        ALM_TOKENS.auditLogWriteRepository,
        ALM_TOKENS.domainEventPublisher,
      ],
    };
  }
}
