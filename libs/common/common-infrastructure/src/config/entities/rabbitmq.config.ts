import { IsBoolean, IsOptional, IsString } from "class-validator";
import { IRabbitMQConfig } from "../interfaces";

/**
 * RabbitMQ configuration class
 */
export class RabbitMQConfig implements IRabbitMQConfig {
  @IsBoolean()
  @IsOptional()
  isEnabled = false;

  @IsString()
  uri!: string;

  @IsString()
  @IsOptional()
  exchange?: string;

  @IsString()
  @IsOptional()
  exchangeType?: string;

  @IsString()
  @IsOptional()
  queueName?: string;

  constructor(partial: Partial<RabbitMQConfig>) {
    Object.assign(this, partial);
  }
}
