import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService as NestConfigService } from '@nestjs/config';
import { appConfig } from './app.config';
import { mongodbConfig } from './mongodb.config';
import { rabbitConfig } from './rabbitmq.config';
import { smtpConfig } from './smtp.config';

export { NestConfigService as ConfigService };

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongodbConfig, rabbitConfig, smtpConfig],
    }),
  ],
  controllers: [],
  providers: [],
  exports: [NestConfigModule],
})
export class ConfigModule {}
