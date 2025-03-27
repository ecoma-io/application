/**
 * @fileoverview Module gốc của ALM Query Service
 * @since 1.0.0
 */

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { MongooseModule } from "@nestjs/mongoose";
import joi from "joi";
import { HealthModule } from "@ecoma/nestjs-health";

@Module({
  imports: [
    // Cấu hình ứng dụng
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: joi.object({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NODE_ENV: joi
          .string()
          .valid("development", "production", "test")
          .default("development"),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PORT: joi.number().default(3000),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        MONGODB_URI: joi.string().required(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NATS_URL: joi.string().required(),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ALM_RABBITMQ_EXCHANGE_NAME: joi.string().default("alm.events"),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ALM_RABBITMQ_EXCHANGE_TYPE: joi.string().default("topic"),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),

    // Kết nối MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),

    // NATS Client để gọi đến IAM service
    ClientsModule.registerAsync([
      {
        name: "IAM_SERVICE", // Tên để inject client, không phải tên queue
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [configService.get<string>("NATS_URL")],
          },
        }),
        inject: [ConfigService],
      },
    ]),


    // Health check
    HealthModule.register({
      mongoEnabled: true,
      natsEnabled: true,
      rabbitmqEnabled: false,
    }),


  ],
})
export class AppModule {}
