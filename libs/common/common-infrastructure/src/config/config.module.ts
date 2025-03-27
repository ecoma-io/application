import { DynamicModule, Module, Provider } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import joi from "joi";
import { ConfigService } from "./config.service";
import { IConfigModuleOptions } from "./interfaces/config-module-options.interface";
import { baseEnvValidationSchema } from "./validation";

export const CUSTOM_APP_CONFIG = "CUSTOM_APP_CONFIG";

@Module({})
export class ConfigModule {
  /**
   * Register config module with options
   * @param options Configuration options
   * @returns Dynamic module
   */
  static register(options: IConfigModuleOptions = {}): DynamicModule {
    const {
      providers = [],
      appConfig,
      envFilePath,
      isGlobal = true,
      validationOptions,
      ...restOptions
    } = options;

    // Combine base env validation schema with any additional schemas
    let validationSchema = baseEnvValidationSchema;

    if (options.validationSchema) {
      validationSchema = options.validationSchema
        ? baseEnvValidationSchema.concat(
            options.validationSchema as joi.ObjectSchema
          )
        : baseEnvValidationSchema;
    }

    // Create module providers
    const moduleProviders: Provider[] = [
      {
        provide: ConfigService,
        useClass: ConfigService,
      },
      ...providers,
    ];

    // Add app config provider if specified
    if (appConfig) {
      moduleProviders.push({
        provide: CUSTOM_APP_CONFIG,
        useClass: appConfig,
      });
    }

    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal,
          envFilePath,
          validationSchema,
          validationOptions: validationOptions || {
            abortEarly: false,
          },
          ...restOptions,
        }),
      ],
      providers: moduleProviders,
      exports: [ConfigService, ...(appConfig ? [CUSTOM_APP_CONFIG] : [])],
    };
  }
}
