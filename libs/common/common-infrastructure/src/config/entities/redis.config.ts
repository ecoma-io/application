import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { IRedisConfig } from "../interfaces";

/**
 * Redis configuration class
 */
export class RedisConfig implements IRedisConfig {
  @IsBoolean()
  @IsOptional()
  isEnabled = false;

  @IsString()
  host!: string;

  @IsNumber()
  port!: number;

  @IsString()
  @IsOptional()
  password?: string;

  @IsNumber()
  @IsOptional()
  db?: number;

  constructor(partial: Partial<RedisConfig>) {
    Object.assign(this, partial);
  }
}
