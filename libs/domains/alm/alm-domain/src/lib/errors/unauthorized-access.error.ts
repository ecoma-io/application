/**
 * @fileoverview Định nghĩa lỗi truy cập không được phép
 * @since 1.0.0
 */

import { DomainError } from '@ecoma/common-domain';

/**
 * Lỗi xảy ra khi người dùng không có quyền truy cập tài nguyên.
 *
 * @example
 * ```typescript
 * throw new UnauthorizedAccessError('User does not have permission to access this policy');
 * ```
 */
export class UnauthorizedAccessError extends DomainError {
  /**
   * Tạo một instance mới của UnauthorizedAccessError.
   *
   * @param message - Thông điệp lỗi chi tiết
   */
  constructor(message: string) {
    super(
      'UNAUTHORIZED_ACCESS',
      message,
      { errorType: 'AUTHORIZATION' }
    );
  }
}
