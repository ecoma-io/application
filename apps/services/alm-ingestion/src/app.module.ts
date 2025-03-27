/**
 * @fileoverview Module gốc của ALM Ingestion Service
 * @since 1.0.0
 */
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
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
        RABBITMQ_URI: joi.string().required(),
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

    // Health check
    HealthModule.register({
      mongoEnabled: true,
      natsEnabled: true,
      rabbitmqEnabled: true,
    }),

  ],
})
export class AppModule { }
