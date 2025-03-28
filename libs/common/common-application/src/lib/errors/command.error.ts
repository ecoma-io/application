/**
 * @fileoverview Lỗi xảy ra khi xử lý command thất bại
 * @since 1.0.0
 */

import { AbstractApplicationError } from './abstract.error';

export class CommandError extends AbstractApplicationError {
  constructor(message: string) {
    super(message);
  }
}
