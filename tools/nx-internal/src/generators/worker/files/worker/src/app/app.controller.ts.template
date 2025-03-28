import { Controller, Get } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from "@nestjs/terminus";

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private microserviceHealthIndicator: MicroserviceHealthIndicator
  ) {}

  @Get("health")
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.microserviceHealthIndicator.pingCheck("rabbitmq", {
          transport: Transport.RMQ,
          options: {
            urls: process.env.RABBITMQ_SERVERS.split(","),
          },
        }),
    ]);
  }
}
