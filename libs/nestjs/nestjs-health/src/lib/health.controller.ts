/**
 * @fileoverview Controller kiểm tra sức khỏe dùng chung cho các dịch vụ
 * @since 1.0.0
 */

import { NestjsLogger } from '@ecoma/nestjs-logging';
import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';
import { IHealthModuleOptions } from './health.module';

@Controller('api/v1/health')
export class HealthController {
  private readonly logger = new NestjsLogger(HealthController.name);

  constructor(
    private readonly health: HealthCheckService,
    private readonly mongooseHealth: MongooseHealthIndicator,
    private readonly microserviceHealth: MicroserviceHealthIndicator,
    private readonly configService: ConfigService,
    @Inject('HEALTH_MODULE_OPTIONS')
    private readonly options: IHealthModuleOptions
  ) {
    const { basePath } = this.options;
    // Dynamically set controller path
    Reflect.defineMetadata('path', basePath, HealthController);
  }

  /**
   * Endpoint kiểm tra sức khỏe tổng thể của service
   * @returns {Promise<any>} Kết quả kiểm tra sức khỏe
   */
  @Get()
  @HealthCheck()
  async check() {
    this.logger.debug('Health check requested');

    const { mongoEnabled, natsEnabled, rabbitmqEnabled, services = [] } = this.options;

    return this.health.check([
      // MongoDB health check
      ...(mongoEnabled
        ? [
            async () => {
              const uri = this.configService.get<string>(
                'MONGODB_URI',
                'mongodb://mongodb:27017/alm'
              );
              this.logger.debug(`Checking MongoDB connection health: ${uri}`);
              return this.mongooseHealth.pingCheck('mongodb', {
                timeout: 1500,
              });
            },
          ]
        : []),

      // NATS health check
      ...(natsEnabled
        ? [
            async () => {
              const natsUrl = this.configService.get<string>(
                'NATS_URL',
                'nats://nats:4222'
              );
              this.logger.debug(`Checking NATS connection health: ${natsUrl}`);
              return this.microserviceHealth.pingCheck('nats', {
                timeout: 1500,
                transport: Transport.NATS,
                options: {
                  servers: [natsUrl],
                },
              });
            },
          ]
        : []),

      // RabbitMQ health check
      ...(rabbitmqEnabled
        ? [
            async () => {
              const rabbitmqUrl = this.configService.get<string>(
                'RABBITMQ_URI',
                'amqp://rabbitmq:5672'
              );
              this.logger.debug(`Checking RabbitMQ connection health: ${rabbitmqUrl}`);
              return this.microserviceHealth.pingCheck('rabbitmq', {
                timeout: 1500,
                transport: Transport.RMQ,
                options: {
                  urls: [rabbitmqUrl],
                  queue: 'health_check_queue',
                  queueOptions: {
                    durable: false,
                  },
                },
              });
            },
          ]
        : []),

      // Custom services health checks
      ...services.map((service) => async () => {
        this.logger.debug(`Checking custom service health: ${service.name}`);
        return this.microserviceHealth.pingCheck(service.name.toLowerCase(), {
          timeout: 1500,
          transport: service.transport,
          options: service.options,
        });
      }),
    ]);
  }
} 