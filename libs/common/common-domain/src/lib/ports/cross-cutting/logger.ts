/**
 * Interface định nghĩa Logger pattern cho cross-cutting concerns.
 * Logger chịu trách nhiệm ghi lại các thông tin, cảnh báo và lỗi trong hệ thống.
 *
 * @example
 * ```typescript
 * class WinstonLogger implements ILogger {
 *   constructor(private readonly logger: winston.Logger) {}
 *
 *   debug(message: string, meta?: Record<string, unknown>): void {
 *     this.logger.debug(message, meta);
 *   }
 *
 *   info(message: string, meta?: Record<string, unknown>): void {
 *     this.logger.info(message, meta);
 *   }
 *
 *   warn(message: string, meta?: Record<string, unknown>): void {
 *     this.logger.warn(message, meta);
 *   }
 *
 *   error(message: string, error?: Error, meta?: Record<string, unknown>): void {
 *     this.logger.error(message, { error, ...meta });
 *   }
 *
 *   fatal(message: string, error?: Error, meta?: Record<string, unknown>): void {
 *     this.logger.fatal(message, { error, ...meta });
 *   }
 * }
 * ```
 */
export interface ILogger {
  /**
   * Ghi log debug - thông tin chi tiết cho việc debug.
   * Thường được sử dụng trong môi trường development.
   *
   * @param message - Thông điệp debug
   * @param meta - Metadata bổ sung (optional)
   */
  debug(message: string, meta?: Record<string, unknown>): void;

  /**
   * Ghi log thông tin.
   *
   * @param message - Thông điệp cần ghi log
   * @param meta - Metadata bổ sung (optional)
   */
  info(message: string, meta?: Record<string, unknown>): void;

  /**
   * Ghi log cảnh báo.
   *
   * @param message - Thông điệp cảnh báo
   * @param meta - Metadata bổ sung (optional)
   */
  warn(message: string, meta?: Record<string, unknown>): void;

  /**
   * Ghi log lỗi.
   *
   * @param message - Thông điệp lỗi
   * @param error - Error object (optional)
   * @param meta - Metadata bổ sung (optional)
   */
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;

  /**
   * Ghi log lỗi nghiêm trọng (fatal).
   * Được sử dụng cho các lỗi nghiêm trọng có thể dẫn đến crash hệ thống.
   *
   * @param message - Thông điệp lỗi fatal
   * @param error - Error object (optional)
   * @param meta - Metadata bổ sung (optional)
   */
  fatal(message: string, error?: Error, meta?: Record<string, unknown>): void;
}
