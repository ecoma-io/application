import { Transport } from "@nestjs/microservices";

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
