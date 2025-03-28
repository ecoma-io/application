import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@ecoma/common-infrastructure';

import { SubscriptionEntity } from './persistence/typeorm/entities/subscription.entity';
import { PricingPlanEntity } from './persistence/typeorm/entities/pricing-plan.entity';
import { UsageRecordEntity } from './persistence/typeorm/entities/usage-record.entity';

import { TypeOrmSubscriptionRepository } from './persistence/typeorm/repositories/subscription.repository';
import { TypeOrmPricingPlanRepository } from './persistence/typeorm/repositories/pricing-plan.repository';
import { RabbitMqEventPublisher } from './message-broker/rabbitmq/event-publisher.service';
import { EntitlementQueryService } from './services/entitlement-query.service';
import { UsageTrackerService } from './services/usage-tracker.service';

import {
  ISubscriptionRepository,
  IPricingPlanRepository
} from '@ecoma/domains/bum/bum-domain';

import {
  IEventPublisherPort,
  IEntitlementQueryPort,
  IUsageTrackerPort
} from '@ecoma/domains/bum/bum-application';

/**
 * Module infrastructure cho BC BUM
 */
@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([
      SubscriptionEntity,
      PricingPlanEntity,
      UsageRecordEntity
    ]),
    RabbitMQModule.forRootAsync(
      RabbitMQModule, {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          exchanges: [
            {
              name: 'bum.events',
              type: 'topic'
            }
          ],
          uri: configService.get<string>('RABBITMQ_URI', 'amqp://guest:guest@localhost:5672'),
          enableControllerDiscovery: true,
          connectionInitOptions: { wait: true },
        })
      }
    )
  ],
  providers: [
    {
      provide: ISubscriptionRepository,
      useClass: TypeOrmSubscriptionRepository
    },
    {
      provide: IPricingPlanRepository,
      useClass: TypeOrmPricingPlanRepository
    },
    {
      provide: IEventPublisherPort,
      useClass: RabbitMqEventPublisher
    },
    {
      provide: IEntitlementQueryPort,
      useClass: EntitlementQueryService
    },
    {
      provide: IUsageTrackerPort,
      useClass: UsageTrackerService
    }
  ],
  exports: [
    ISubscriptionRepository,
    IPricingPlanRepository,
    IEventPublisherPort,
    IEntitlementQueryPort,
    IUsageTrackerPort
  ]
})
export class BumInfrastructureModule {}
