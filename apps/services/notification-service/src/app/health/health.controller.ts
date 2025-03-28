import { Controller, Get } from "@nestjs/common";
import { Transport } from "@nestjs/microservices";
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from "@nestjs/terminus";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private microserviceHealthIndicator: MicroserviceHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () =>
        this.microserviceHealthIndicator.pingCheck("nats", {
          transport: Transport.NATS,
          options: {
            servers: process.env.NATS_SERVERS.split(","),
          },
        }),
    ]);
  }
}
