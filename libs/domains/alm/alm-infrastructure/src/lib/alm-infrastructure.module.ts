import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { CqrsModule } from '@nestjs/cqrs';

import { AuditLogEntryEntity, AuditLogEntrySchema } from './persistence/mongodb/entities/audit-log-entry.entity';
import { AuditLogMongoRepository } from './persistence/mongodb/repositories/audit-log.repository';
import { RabbitMQDomainEventPublisher } from './message-broker/rabbitmq/domain-event.publisher';
import { PersistAuditLogNatsHandler } from './nats-rpc/inbound/command-handlers/persist-audit-log.handler';
import { GetAuditLogsNatsHandler } from './nats-rpc/inbound/query-handlers/get-audit-logs.handler';
import { ALM_TOKENS } from './tokens';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: AuditLogEntryEntity.name, schema: AuditLogEntrySchema }
    ]),
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'alm.events',
          type: 'topic'
        }
      ],
      uri: process.env['RABBITMQ_URI'] || 'amqp://localhost:5672'
    })
  ],
  providers: [
    // Repositories
    {
      provide: ALM_TOKENS.auditLogReadRepository,
      useClass: AuditLogMongoRepository
    },
    {
      provide: ALM_TOKENS.auditLogWriteRepository,
      useClass: AuditLogMongoRepository
    },
    // Event Publisher
    {
      provide: ALM_TOKENS.domainEventPublisher,
      useClass: RabbitMQDomainEventPublisher
    },
    // NATS Handlers
    PersistAuditLogNatsHandler,
    GetAuditLogsNatsHandler
  ],
  exports: [
    ALM_TOKENS.auditLogReadRepository,
    ALM_TOKENS.auditLogWriteRepository,
    ALM_TOKENS.domainEventPublisher
  ]
})
export class AlmInfrastructureModule {}
