import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationTemplate, NotificationTemplateSchema } from './schemas/notification-template.schema';
import { NotificationTemplateRepository } from './repositories/notification-template.repository';
import { ConfigService } from '@nestjs/config';
import { MongodbConfig } from '../config/mongodb.config';
import { NotificationHistory, NotificationHistorySchema } from './schemas/notification-history.schema';
import { NotificationHistoryRepository } from './repositories/notification-history.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get<MongodbConfig>('mongodb'),
    }),
    MongooseModule.forFeature([
      { name: NotificationTemplate.name, schema: NotificationTemplateSchema },
      { name: NotificationHistory.name, schema: NotificationHistorySchema },
    ]),
  ],
  providers: [NotificationTemplateRepository, NotificationHistoryRepository],
  exports: [NotificationTemplateRepository, NotificationHistoryRepository]
})
export class DatabaseModule {}
