import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Domain Entities
import {
  PaymentTransactionEntity,
  PaymentAttemptEntity,
  RefundEntity,
  PaymentGatewayConfigurationEntity,
} from './persistence/models/typeorm';

// Repositories
import {
  PaymentTransactionRepository,
  PaymentGatewayConfigurationRepository,
} from './persistence/repositories';

// Message Broker
import { RabbitMQEventEmitter } from './message-broker';

// Payment Gateways
import {
  StripePaymentGatewayAdapter,
  PayPalPaymentGatewayAdapter,
  PaymentGatewayFactoryService,
} from './external-services/payment-gateways';

// Payment Processor
import { PaymentProcessorService } from './external-services/payment-processor';

// Domain & Application Layer Interfaces
import {
  IPaymentTransactionRepository,
  IPaymentGatewayConfigurationRepository,
} from '@ecoma/ppm-domain';
import { IEventEmitter, IPaymentProcessor } from '@ecoma/ppm-application';

/**
 * Cung cấp các implementation của Infrastructure Layer cho PPM Bounded Context
 */
@Module({
  imports: [
    // TypeORM Entities
    TypeOrmModule.forFeature([
      PaymentTransactionEntity,
      PaymentAttemptEntity,
      RefundEntity,
      PaymentGatewayConfigurationEntity,
    ]),

    // RabbitMQ Module
    RabbitMQModule.forRootAsync(
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          exchanges: [
            {
              name: 'ppm.events',
              type: 'topic',
            },
          ],
          uri: configService.get<string>('RABBITMQ_URI'),
          connectionInitOptions: { wait: false },
          enableControllerDiscovery: true,
        }),
      },
    ),
  ],
  providers: [
    // Repositories
    {
      provide: IPaymentTransactionRepository,
      useClass: PaymentTransactionRepository,
    },
    {
      provide: IPaymentGatewayConfigurationRepository,
      useClass: PaymentGatewayConfigurationRepository,
    },

    // Message Broker
    {
      provide: IEventEmitter,
      useClass: RabbitMQEventEmitter,
    },

    // Payment Gateways
    StripePaymentGatewayAdapter,
    PayPalPaymentGatewayAdapter,
    PaymentGatewayFactoryService,

    // Payment Processor
    {
      provide: IPaymentProcessor,
      useClass: PaymentProcessorService,
    },
  ],
  exports: [
    // Repositories
    IPaymentTransactionRepository,
    IPaymentGatewayConfigurationRepository,

    // Message Broker
    IEventEmitter,

    // Payment Processor
    IPaymentProcessor,
  ],
})
export class PpmInfrastructureModule {}
