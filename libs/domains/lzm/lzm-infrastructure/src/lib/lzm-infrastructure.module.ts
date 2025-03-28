import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

// TypeORM Entities
import { TranslationSetEntity, TranslationKeyEntity, TranslationEntity } from './persistence/typeorm/entities';

// Repositories
import { TypeOrmTranslationSetRepository, TypeOrmTranslationKeyRepository, TypeOrmTranslationRepository } from './persistence/typeorm/repositories';

// Adapters
import { LzmPersistenceAdapter } from './persistence/lzm-persistence.adapter';
import { LzmMessageBrokerAdapter } from './message-broker/lzm-message-broker.adapter';
import { RdmServiceAdapter } from './external-services/rdm-service.adapter';
import { TranslationServiceAdapter } from './external-services/translation-service.adapter';

// Port Tokens
import {
  LZM_PERSISTENCE_PORT,
  LZM_MESSAGE_BROKER_PORT,
  RDM_SERVICE_PORT,
  TRANSLATION_SERVICE_PORT
} from '@ecoma/domains/lzm/lzm-application';

/**
 * Module cung cấp infrastructure cho LZM
 * Bao gồm các implementation của các port/adapter
 */
@Module({
  imports: [
    // Đăng ký TypeORM Entities
    TypeOrmModule.forFeature([
      TranslationSetEntity,
      TranslationKeyEntity,
      TranslationEntity,
    ]),

    // HTTP Module cho gọi các service bên ngoài
    HttpModule,

    // Config Module
    ConfigModule,

    // NATS cho request/reply
    ClientsModule.registerAsync([
      {
        name: 'NATS_CLIENT',
        useFactory: (configService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get<string>('NATS_URL', 'nats://localhost:4222')],
            queue: 'lzm_queue',
          },
        }),
        inject: [ConfigService],
      },
    ]),

    // RabbitMQ cho events
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_CLIENT',
        useFactory: (configService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
            queue: 'lzm_events',
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    // TypeORM Repositories
    TypeOrmTranslationSetRepository,
    TypeOrmTranslationKeyRepository,
    TypeOrmTranslationRepository,

    // Port/Adapter Implementations
    {
      provide: LZM_PERSISTENCE_PORT,
      useClass: LzmPersistenceAdapter,
    },
    {
      provide: LZM_MESSAGE_BROKER_PORT,
      useClass: LzmMessageBrokerAdapter,
    },
    {
      provide: RDM_SERVICE_PORT,
      useClass: RdmServiceAdapter,
    },
    {
      provide: TRANSLATION_SERVICE_PORT,
      useClass: TranslationServiceAdapter,
    },
  ],
  exports: [
    LZM_PERSISTENCE_PORT,
    LZM_MESSAGE_BROKER_PORT,
    RDM_SERVICE_PORT,
    TRANSLATION_SERVICE_PORT,
  ],
})
export class LzmInfrastructureModule {}
