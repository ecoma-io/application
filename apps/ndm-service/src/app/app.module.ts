import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ConfigModule } from './config/config.module';
import { TemplatesModule } from './templates/templates.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule,
    HealthModule,
    TemplatesModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
