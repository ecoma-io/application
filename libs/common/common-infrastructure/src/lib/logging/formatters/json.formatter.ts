/**
 * @fileoverview Formatter cho log dạng JSON
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';

/**
 * Formatter cho log dạng JSON
 */
@Injectable()
export class JsonLogFormatter {
  /**
   * Format log message thành JSON
   * @param {string} level - Cấp độ log
   * @param {string} message - Thông điệp log
   * @param {Record<string, unknown>} [context] - Context của log
   * @returns {string} Log message đã được format
   */
  format(level: string, message: string, context?: Record<string, unknown>): string {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context
    };

    return JSON.stringify(logEntry);
  }
}
