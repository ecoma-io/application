import { DomainError } from '@ecoma/common-domain';

/**
 * Lỗi xảy ra khi đơn vị thời gian lưu trữ không hợp lệ.
 *
 * @example
 * ```typescript
 * throw new RetentionDurationUnitError('Invalid retention duration unit: invalid_unit');
 * ```
 */
export class RetentionDurationUnitError extends DomainError {
  /**
   * Tạo một instance mới của RetentionDurationUnitError.
   *
   * @param message - Thông điệp lỗi chi tiết
   */
  constructor(message: string) {
    super(
      'INVALID_RETENTION_DURATION_UNIT',
      message,
      { errorType: 'RETENTION_POLICY' }
    );
  }
}
