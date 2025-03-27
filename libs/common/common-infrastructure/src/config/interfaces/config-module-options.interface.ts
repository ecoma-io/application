import { Type } from "@nestjs/common";
import { ConfigModuleOptions as NestConfigModuleOptions } from "@nestjs/config";
import { AppConfig } from "../entities/app.config";

/**
 * Interface for ConfigModule options
 */
export interface IConfigModuleOptions extends NestConfigModuleOptions {
  /**
   * Additional configuration providers
   */
  providers?: Type<any>[];

  /**
   * Application-specific configuration
   */
  appConfig?: Type<AppConfig>;
}
