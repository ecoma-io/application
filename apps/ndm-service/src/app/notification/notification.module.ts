import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '../config/config.module';
import { RabbitmqConfig } from '../config/rabbitmq.config';
import { NotificationService } from './notification.service';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    EmailModule,
    DatabaseModule,
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<RabbitmqConfig>('rabbitmq'),
        connectionInitOptions: {
          wait: true,
          timeout: 30_000,
        },
        connectionManagerOptions: {
          connectionOptions: {
            timeout: 30_000
          }
        },
        exchanges: [
          {
            name: 'notification',
            type: 'topic',
            createExchangeIfNotExists: true,
            options: {
              durable: true
            }
          }
        ]
      }),
    })
  ],
  providers: [NotificationService],
})
export class NotificationModule { }
