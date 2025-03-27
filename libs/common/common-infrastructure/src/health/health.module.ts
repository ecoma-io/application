/**
 * @fileoverview Module kiểm tra sức khỏe dùng chung cho các dịch vụ
 * @since 1.0.0
 */

import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";
import { TerminusModule } from "@nestjs/terminus";

import { HealthController } from "./health.controller";
import { IHealthModuleOptions } from "./health.options";

@Module({})
export class HealthModule {
  /**
   * Tạo module health check với các options tùy chỉnh
   * @param {IHealthModuleOptions} options - Các tùy chọn cấu hình health check
   * @returns {DynamicModule} Module health check được cấu hình
   */
  static register(options: IHealthModuleOptions = {}): DynamicModule {
    const {
      mongoEnabled = true,
      natsEnabled = true,
      rabbitmqEnabled = false,
      services = [],
      basePath = "api/v1/health",
    } = options;

    const microserviceClients = [];

    // Thêm NATS service nếu được bật
    if (natsEnabled) {
      microserviceClients.push({
        name: "NATS_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ["nats://nats:4222"],
        },
      });
    }

    // Thêm RabbitMQ service nếu được bật
    if (rabbitmqEnabled) {
      microserviceClients.push({
        name: "RABBITMQ_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://rabbitmq:5672"],
          queue: "health_check_queue",
          queueOptions: {
            durable: false,
          },
        },
      });
    }

    // Thêm các service tùy chỉnh
    microserviceClients.push(...services);

    return {
      module: HealthModule,
      imports: [TerminusModule, ConfigModule],
      controllers: [HealthController],
      providers: [
        {
          provide: "HEALTH_MODULE_OPTIONS",
          useValue: {
            mongoEnabled,
            natsEnabled,
            rabbitmqEnabled,
            services,
            basePath,
          },
        },
      ],
    };
  }
}
