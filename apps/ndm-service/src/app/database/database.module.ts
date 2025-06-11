import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationTemplate, NotificationTemplateSchema } from './schemas/notification-template.schema';
import { NotificationTemplateRepository } from './repositories/notification-template.repository';
import { ConfigService } from '@nestjs/config';
import { MongodbConfig } from '../config/mongodb.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get<MongodbConfig>('mongodb'),
    }),
    MongooseModule.forFeature([
      { name: NotificationTemplate.name, schema: NotificationTemplateSchema },
    ]),
  ],
  providers: [NotificationTemplateRepository],
  exports: [NotificationTemplateRepository]
})
export class DatabaseModule {}
