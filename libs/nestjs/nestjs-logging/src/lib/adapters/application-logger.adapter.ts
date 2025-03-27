import { ILogger } from "@ecoma/common-application";
import { Injectable } from "@nestjs/common";
import { NestjsLogger } from "../nestjs-logger";

/**
 * Adapter tích hợp NestjsLogger với ILogger interface từ common-application
 *
 * @since 1.0.0
 * @implements {ILogger}
 *
 * @example
 * ```typescript
 * // Đăng ký trong provider
 * @Module({
 *   providers: [
 *     NestjsLogger,
 *     {
 *       provide: 'APPLICATION_LOGGER',
 *       useClass: ApplicationLoggerAdapter,
 *     },
 *   ],
 * })
 *
 * // Sử dụng trong service
 * @Injectable()
 * class MyApplicationService {
 *   constructor(@Inject('APPLICATION_LOGGER') private logger: ILogger) {}
 *
 *   process() {
 *     this.logger.debug('Đang xử lý application logic');
 *   }
 * }
 * ```
 */
@Injectable()
export class ApplicationLoggerAdapter implements ILogger {
  /**
   * Tạo một instance mới của ApplicationLoggerAdapter
   *
   * @param {NestjsLogger} logger - Instance của NestjsLogger
   * @param {string} [context] - Context mặc định cho logger này
   */
  constructor(
    private readonly logger: NestjsLogger,
    private readonly context?: string
  ) {
    if (context) {
      this.logger.setContext(context);
    }
  }

  /**
   * Ghi log ở mức DEBUG
   *
   * @param {string} message - Nội dung log
   * @param {Record<string, unknown>} [meta] - Metadata bổ sung
   */
  debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug({ message, ...meta });
  }

  /**
   * Ghi log ở mức INFO
   *
   * @param {string} message - Nội dung log
   * @param {Record<string, unknown>} [meta] - Metadata bổ sung
   */
  info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info({ message, ...meta });
  }

  /**
   * Ghi log ở mức WARN
   *
   * @param {string} message - Nội dung log
   * @param {Record<string, unknown>} [meta] - Metadata bổ sung
   */
  warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn({ message, ...meta });
  }

  /**
   * Ghi log ở mức ERROR
   *
   * @param {string} message - Nội dung log
   * @param {Error} [error] - Error object (nếu có)
   * @param {Record<string, unknown>} [meta] - Metadata bổ sung
   */
  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    if (error) {
      this.logger.error({ message, error, ...meta });
    } else {
      this.logger.error({ message, ...meta });
    }
  }

  /**
   * Ghi log ở mức FATAL
   *
   * @param {string} message - Nội dung log
   * @param {Error} [error] - Error object (nếu có)
   * @param {Record<string, unknown>} [meta] - Metadata bổ sung
   */
  fatal(message: string, error?: Error, meta?: Record<string, unknown>): void {
    if (error) {
      this.logger.fatal({ message, error, ...meta });
    } else {
      this.logger.fatal({ message, ...meta });
    }
  }
}
