import { IsBoolean, IsOptional, IsString } from "class-validator";
import { INatsConfig } from "../interfaces";

/**
 * NATS configuration class
 */
export class NatsConfig implements INatsConfig {
  @IsBoolean()
  @IsOptional()
  isEnabled = false;

  @IsString()
  url!: string;

  constructor(partial: Partial<NatsConfig>) {
    Object.assign(this, partial);
  }
}
