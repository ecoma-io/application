import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AuditLogIngestionService } from "./ingestion.service";
import { AuditLogSchema } from "./schemas/audit-log.schema";

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("app.rabbitmq.uri"),
        exchanges: [
          {
            name: configService.get<string>("app.rabbitmq.exchange.name"),
            type: configService.get<string>("app.rabbitmq.exchange.type"),
          },
        ],
        enableControllerDiscovery: true,
      }),
    }),
    MongooseModule.forFeature([{ name: "AuditLog", schema: AuditLogSchema }]),
  ],
  providers: [AuditLogIngestionService],
  exports: [AuditLogIngestionService],
})
export class IngestionModule {}
