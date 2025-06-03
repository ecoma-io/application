import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DatabaseModule } from "../database/database.module";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { ConfigModule, ConfigService } from "../config/config.module";
import { RabbitmqConfig } from "../config/rabbitmq.config";

@Module({
  imports: [
    DatabaseModule,
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get<RabbitmqConfig>("rabbitmq")
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {

}