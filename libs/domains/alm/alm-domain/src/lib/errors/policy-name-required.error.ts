import { DomainError } from '@ecoma/common-domain';

/**
 * Lỗi xảy ra khi tên policy không được cung cấp.
 *
 * @example
 * ```typescript
 * throw new PolicyNameRequiredError('Policy name is required');
 * ```
 */
export class PolicyNameRequiredError extends DomainError {
  /**
   * Tạo một instance mới của PolicyNameRequiredError.
   *
   * @param message - Thông điệp lỗi chi tiết
   */
  constructor(message: string) {
    super(
      'POLICY_NAME_REQUIRED',
      message,
      { errorType: 'RETENTION_POLICY' }
    );
  }
}
