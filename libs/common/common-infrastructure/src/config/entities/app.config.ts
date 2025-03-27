import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";

export enum Environment {
  Development = "development",
  Production = "production",
  Test = "test",
}

export enum LogLevel {
  Trace = "trace",
  Debug = "debug",
  Info = "info",
  Warn = "warn",
  Error = "error",
}

export enum LogFormat {
  Json = "json",
  Text = "text",
}

/**
 * Base application configuration class
 */
export class AppConfig {
  @IsEnum(Environment)
  @IsOptional()
  env: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  port = 3000;

  @IsBoolean()
  @IsOptional()
  debug = false;

  @IsEnum(LogLevel)
  @IsOptional()
  logLevel: LogLevel = LogLevel.Info;

  @IsEnum(LogFormat)
  @IsOptional()
  logFormat: LogFormat = LogFormat.Json;
}
