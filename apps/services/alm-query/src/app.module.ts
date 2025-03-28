/**
 * @fileoverview Module gốc của ALM Query Service
 * @since 1.0.0
 */

import { AlmInfrastructureModule } from "@ecoma/alm-infrastructure";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    // Cấu hình môi trường
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Kết nối MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>("MONGODB_URI") ||
          "mongodb://localhost:27017/alm",
      }),
      inject: [ConfigService],
    }),

    // Import ALM Infrastructure module
    AlmInfrastructureModule,

    // Health check module
    HealthModule,
  ],
})
export class AppModule {}
