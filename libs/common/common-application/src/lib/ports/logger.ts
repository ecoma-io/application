/**
 * @fileoverview Interface định nghĩa các phương thức ghi log
 * @since 1.0.0
 */

/**
 * Interface định nghĩa các phương thức ghi log
 */
export abstract class AbstractLogger {
  /**
   * Đặt context cho logger
   * @param {string} context - Context
   */
  abstract setContext(context: string): void;

  /**
   * Ghi log ở mức DEBUG
   * @param {string} message - Nội dung log
   * @param {Object} [optionalParams] - Context bổ sung
   */
  abstract debug(
    message: string,
    optionalParams?: Record<string, unknown>
  ): void;

  /**
   * Ghi log ở mức INFO
   * @param {string} message - Nội dung log
   * @param {Object} [optionalParams] - Context bổ sung
   */
  abstract info(
    message: string,
    optionalParams?: Record<string, unknown>
  ): void;

  /**
   * Ghi log ở mức WARN
   * @param {string} message - Nội dung log
   * @param {Object} [optionalParams] - Context bổ sung
   */
  abstract warn(
    message: string,
    optionalParams?: Record<string, unknown>
  ): void;

  /**
   * Ghi log ở mức ERROR
   * @param {string} message - Nội dung log
   * @param {Error} [error] - Lỗi nếu có
   * @param {Object} [optionalParams] - Context bổ sung
   */
  abstract error(
    message: string,
    error?: Error,
    optionalParams?: Record<string, unknown>
  ): void;

  /**
   * Ghi log ở mức FATAL
   * @param {string} message - Nội dung log
   * @param {Error} [error] - Lỗi nếu có
   * @param {Object} [optionalParams] - Context bổ sung
   */
  abstract fatal(
    message: string,
    error?: Error,
    optionalParams?: Record<string, unknown>
  ): void;
}
