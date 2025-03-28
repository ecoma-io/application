import { DomainError } from '@ecoma/common-domain';

/**
 * Lỗi xảy ra khi không có quy tắc lưu trữ nào được định nghĩa.
 *
 * @example
 * ```typescript
 * throw new RetentionRuleRequiredError('At least one retention rule is required');
 * ```
 */
export class RetentionRuleRequiredError extends DomainError {
  /**
   * Tạo một instance mới của RetentionRuleRequiredError.
   *
   * @param message - Thông điệp lỗi chi tiết
   */
  constructor(message: string) {
    super(
      'RETENTION_RULE_REQUIRED',
      message,
      { errorType: 'RETENTION_POLICY' }
    );
  }
}
