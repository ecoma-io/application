import { DynamicModule, Module } from "@nestjs/common";
import { NestjsLogger } from "./nestjs-logger";

/**
 * Tùy chọn cấu hình cho NestjsLoggerModule
 */
export interface INestjsLoggerModuleOptions {
  /**
   * Tên context mặc định cho logger
   */
  defaultContext?: string;

  /**
   * Flag xác định liệu module có nên là global hay không
   */
  isGlobal?: boolean;
}

/**
 * Module cung cấp NestjsLogger cho ứng dụng NestJS
 *
 * @example
 * ```typescript
 * // Sử dụng cấu hình mặc định
 * @Module({
 *   imports: [NestjsLoggerModule.register()],
 * })
 * export class AppModule {}
 *
 * // Sử dụng với cấu hình tùy chỉnh
 * @Module({
 *   imports: [
 *     NestjsLoggerModule.register({
 *       defaultContext: 'MyApp',
 *       isGlobal: true,
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  providers: [NestjsLogger],
  exports: [NestjsLogger],
})
export class NestjsLoggerModule {
  /**
   * Đăng ký module với các tùy chọn
   *
   * @param {INestjsLoggerModuleOptions} [options] - Các tùy chọn cấu hình cho module
   * @returns {DynamicModule} Dynamic module cho NestJS
   */
  static register(options: INestjsLoggerModuleOptions = {}): DynamicModule {
    const { defaultContext, isGlobal = false } = options;

    return {
      module: NestjsLoggerModule,
      global: isGlobal,
      providers: [
        {
          provide: NestjsLogger,
          useFactory: () => {
            return new NestjsLogger(defaultContext);
          },
        },
      ],
      exports: [NestjsLogger],
    };
  }
}
