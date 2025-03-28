import { DomainError } from '@ecoma/common-domain';

/**
 * Lỗi xảy ra khi giá trị thời gian lưu trữ không hợp lệ.
 *
 * @example
 * ```typescript
 * throw new RetentionDurationValueError('Retention duration must be greater than 0');
 * ```
 */
export class RetentionDurationValueError extends DomainError {
  /**
   * Tạo một instance mới của RetentionDurationValueError.
   *
   * @param message - Thông điệp lỗi chi tiết
   */
  constructor(message: string) {
    super(
      'INVALID_RETENTION_DURATION_VALUE',
      message,
      { errorType: 'RETENTION_POLICY' }
    );
  }
}
