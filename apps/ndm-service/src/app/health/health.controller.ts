import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { PinoLogger } from '@ecoma/nestjs-logger';

@Controller('health')
export class HealthController {

  private readonly logger = new PinoLogger(HealthController.name);

  constructor(private health: HealthCheckService, private db: MongooseHealthIndicator) { }

  @Get()
  @HealthCheck()
  getHealth(): Promise<HealthCheckResult> {
    this.logger.debug('Performing health check');
    return this.health.check([
      () => {
        return this.db.pingCheck('mongodb');
      }
    ]);
  }
}
