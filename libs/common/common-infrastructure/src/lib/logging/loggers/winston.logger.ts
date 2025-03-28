/**
 * @fileoverview Logger sử dụng Winston
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { createLogger, Logger, format, transports } from 'winston';

/**
 * Logger sử dụng Winston
 */
@Injectable()
export class WinstonLogger {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.json()
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          )
        })
      ]
    });
  }

  /**
   * Ghi log cấp độ error
   * @param {string} message - Thông điệp lỗi
   * @param {Record<string, unknown>} [context] - Context của lỗi
   */
  error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(message, context);
  }

  /**
   * Ghi log cấp độ warn
   * @param {string} message - Thông điệp cảnh báo
   * @param {Record<string, unknown>} [context] - Context của cảnh báo
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(message, context);
  }

  /**
   * Ghi log cấp độ info
   * @param {string} message - Thông điệp thông tin
   * @param {Record<string, unknown>} [context] - Context của thông tin
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(message, context);
  }

  /**
   * Ghi log cấp độ debug
   * @param {string} message - Thông điệp debug
   * @param {Record<string, unknown>} [context] - Context của debug
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(message, context);
  }
}
