/**
 * @fileoverview Lỗi xảy ra khi validation thất bại
 * @since 1.0.0
 */

import { AbstractApplicationError } from './abstract.error';

export class ValidationError extends AbstractApplicationError {
  constructor(message: string) {
    super(message);
  }
}
