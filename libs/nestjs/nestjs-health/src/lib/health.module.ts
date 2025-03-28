/**
 * @fileoverview Module kiểm tra sức khỏe dùng chung cho các dịch vụ
 * @since 1.0.0
 */

import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

export interface IHealthModuleOptions {
  mongoEnabled?: boolean;
  natsEnabled?: boolean;
  rabbitmqEnabled?: boolean;
  services?: {
    name: string;
    transport: Transport;
    options: Record<string, unknown>;
  }[];
  basePath?: string;
}

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
      basePath = 'api/v1/health',
    } = options;

    const microserviceClients = [];

    // Thêm NATS service nếu được bật
    if (natsEnabled) {
      microserviceClients.push({
        name: 'NATS_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: ['nats://nats:4222'],
        },
      });
    }

    // Thêm RabbitMQ service nếu được bật
    if (rabbitmqEnabled) {
      microserviceClients.push({
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'health_check_queue',
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
      imports: [
        TerminusModule,
        ConfigModule,
        ...(microserviceClients.length > 0
          ? [
              ClientsModule.registerAsync(
                microserviceClients.map((client) => ({
                  name: client.name,
                  useFactory: (configService: ConfigService) => ({
                    transport: client.transport,
                    options: {
                      ...client.options,
                      servers:
                        client.transport === Transport.NATS
                          ? [
                              configService.get<string>(
                                'NATS_URL',
                                'nats://nats:4222'
                              ),
                            ]
                          : undefined,
                      urls:
                        client.transport === Transport.RMQ
                          ? [
                              configService.get<string>(
                                'RABBITMQ_URI',
                                'amqp://rabbitmq:5672'
                              ),
                            ]
                          : undefined,
                    },
                  }),
                  inject: [ConfigService],
                }))
              ),
            ]
          : []),
      ],
      controllers: [HealthController],
      providers: [
        {
          provide: 'HEALTH_MODULE_OPTIONS',
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