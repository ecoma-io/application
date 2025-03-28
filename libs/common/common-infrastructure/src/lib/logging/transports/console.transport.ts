/**
 * @fileoverview Transport ghi log ra console
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';

/**
 * Transport ghi log ra console
 */
@Injectable()
export class ConsoleLogTransport {
  /**
   * Ghi log ra console
   * @param {string} formattedMessage - Thông điệp log đã được format
   */
  write(formattedMessage: string): void {
    // eslint-disable-next-line no-console
    console.log(formattedMessage);
  }
}
