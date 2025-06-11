

import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule, ConfigService as NestConfigService } from "@nestjs/config";
import { appConfig } from "./app.config";
import { mongodbConfig } from "./mongodb.config";
import { rabbitmqConfig } from "./rabbitmq.config";


export { NestConfigService as ConfigService };

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongodbConfig, rabbitmqConfig],
    })
  ],
  controllers: [],
  providers: [],
  exports: [NestConfigModule]
})
export class ConfigModule { }
