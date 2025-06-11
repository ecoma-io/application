import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MongooseHealthIndicator,
} from "@nestjs/terminus";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator
  ) { }

  @Get()
  @HealthCheck()
  getHealth(): Promise<HealthCheckResult> {
    return this.health.check([() => this.db.pingCheck("mongodb")]);
  }
}
