/**
 * @fileoverview Module xử lý truy vấn audit logs
 * @since 1.0.0
 */

import { AlmInfrastructureModule } from "@ecoma/alm-infrastructure";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuditLogsController } from "./audit-logs.controller";
import { AuditLogsService } from "./audit-logs.service";

/**
 * Module xử lý truy vấn audit logs
 */
@Module({
  imports: [
    // Import ALM infrastructure module để sử dụng các repository
    AlmInfrastructureModule.registerAsync(),

    // NATS Client để gọi đến IAM service nếu cần kiểm tra quyền
    ClientsModule.registerAsync([
      {
        name: "IAM_SERVICE",
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
  ],
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
})
export class AuditLogsModule {}
