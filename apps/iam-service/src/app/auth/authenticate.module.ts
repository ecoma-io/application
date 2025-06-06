import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { ConfigModule, ConfigService } from "../config/config.module";
import { RabbitmqConfig } from "../config/rabbitmq.config";
import { AuthenticateService } from "./authenticate.service";
import { AuthenticateController } from "./authenticate.controller";

@Module({
  imports: [
    DatabaseModule,
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<RabbitmqConfig>('rabbitmq'),
        exchanges: [
          {
            name: 'notification',
            type: 'topic',
            createExchangeIfNotExists: true,
          }
        ],
        connectionInitOptions: {
          wait: true,
          timeout: 30_000,
        },
        connectionManagerOptions: {
          connectionOptions: {
            timeout: 30_000
          }
        }
      }),
    }),
  ],
  controllers: [AuthenticateController],
  providers: [AuthenticateService]
})
export class AuthenticateModule {

}