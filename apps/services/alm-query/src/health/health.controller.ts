/**
 * @fileoverview Controller kiểm tra sức khỏe của service
 * @since 1.0.0
 */

import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from "@nestjs/terminus";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // Kiểm tra kết nối MongoDB
      () => this.mongoose.pingCheck("mongodb"),
    ]);
  }
}
