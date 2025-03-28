/**
 * @fileoverview Module xử lý xác thực quyền truy cập
 * @since 1.0.0
 */

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthService } from "./auth.service";

/**
 * Module xử lý xác thực quyền truy cập
 */
@Module({
  imports: [
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
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
