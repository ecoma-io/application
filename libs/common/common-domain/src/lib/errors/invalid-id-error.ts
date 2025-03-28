import { DomainError } from "./domain-error";

/**
 * Lỗi xảy ra khi ID không hợp lệ.
 *
 * @example
 * ```typescript
 * throw new InvalidIdError('Invalid UUID format');
 * ```
 */
export class InvalidIdError extends DomainError {
  /**
   * Tạo một instance mới của InvalidIdError.
   *
   * @param message - Thông điệp lỗi chi tiết
   */
  constructor(message: string) {
    super(
      'INVALID_ID_FORMAT',
      message,
      { errorType: 'ID_VALIDATION' }
    );
  }
}

