import { DomainError } from '@ecoma/common-domain';

/**
 * Lỗi xảy ra khi không tìm thấy policy.
 *
 * @example
 * ```typescript
 * throw new PolicyNotFoundError('Policy with ID 123 not found');
 * ```
 */
export class PolicyNotFoundError extends DomainError {
  /**
   * Tạo một instance mới của PolicyNotFoundError.
   *
   * @param message - Thông điệp lỗi chi tiết
   */
  constructor(message: string) {
    super(
      'POLICY_NOT_FOUND',
      message,
      { errorType: 'RETENTION_POLICY' }
    );
  }
}
