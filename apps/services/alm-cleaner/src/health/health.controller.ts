/**
 * @fileoverview Controller kiểm tra sức khỏe cho dịch vụ ALM Cleaner
 * @since 1.0.0
 */

import { NestjsLogger } from "@ecoma/nestjs-logging";
import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
  MongooseHealthIndicator,
} from "@nestjs/terminus";
import { Transport } from "@nestjs/microservices";

@Controller("api/v1/health")
export class HealthController {
  private readonly logger = new NestjsLogger(HealthController.name);

  constructor(
    private readonly health: HealthCheckService,
    private readonly mongooseHealth: MongooseHealthIndicator,
    private readonly microserviceHealth: MicroserviceHealthIndicator,
    private readonly configService: ConfigService
  ) {}

  /**
   * Endpoint để kiểm tra sức khỏe của dịch vụ
   * @returns Kết quả kiểm tra sức khỏe
   */
  @Get()
  @HealthCheck()
  async check() {
    this.logger.debug("Health check requested");

    return this.health.check([
      // MongoDB health check
      async () => {
        const uri = this.configService.get<string>("MONGODB_URI");
        this.logger.debug(`Checking MongoDB connection health: ${uri}`);
        return this.mongooseHealth.pingCheck("mongodb", { timeout: 1500 });
      },

      // NATS health check
      async () => {
        const natsUrl = this.configService.get<string>("NATS_URL");
        this.logger.debug(`Checking NATS connection health: ${natsUrl}`);
        return this.microserviceHealth.pingCheck("nats", {
          timeout: 1500,
          transport: Transport.NATS,
          options: {
            servers: [natsUrl],
          },
        });
      },
    ]);
  }
} 