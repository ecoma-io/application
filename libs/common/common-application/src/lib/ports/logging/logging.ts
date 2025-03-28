/**
 * @fileoverview Interface định nghĩa các phương thức ghi log
 * @since 1.0.0
 */

/**
 * Các mức độ log
 */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

/**
 * Interface định nghĩa các phương thức ghi log
 */
export interface ILogger {
  /**
   * Ghi log ở mức DEBUG
   * @param {string} message - Nội dung log
   * @param {Object} [context] - Context bổ sung
   */
  debug(message: string, context?: Record<string, unknown>): void;

  /**
   * Ghi log ở mức INFO
   * @param {string} message - Nội dung log
   * @param {Object} [context] - Context bổ sung
   */
  info(message: string, context?: Record<string, unknown>): void;

  /**
   * Ghi log ở mức WARN
   * @param {string} message - Nội dung log
   * @param {Object} [context] - Context bổ sung
   */
  warn(message: string, context?: Record<string, unknown>): void;

  /**
   * Ghi log ở mức ERROR
   * @param {string} message - Nội dung log
   * @param {Error} [error] - Lỗi nếu có
   * @param {Object} [context] - Context bổ sung
   */
  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void;

  /**
   * Ghi log ở mức FATAL
   * @param {string} message - Nội dung log
   * @param {Error} [error] - Lỗi nếu có
   * @param {Object} [context] - Context bổ sung
   */
  fatal(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void;
}
