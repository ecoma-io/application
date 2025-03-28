/**
 * @fileoverview Lỗi xảy ra khi xử lý query thất bại
 * @since 1.0.0
 */

import { AbstractApplicationError } from './abstract.error';

export class QueryError extends AbstractApplicationError {
  constructor(message: string) {
    super(message);
  }
}
