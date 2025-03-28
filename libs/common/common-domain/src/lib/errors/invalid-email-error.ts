import { DomainError } from "./domain-error";

/**
 * Lỗi xảy ra khi email không đúng định dạng.
 *
 * @example
 * ```typescript
 * throw new InvalidEmailError('invalid.email');
 * ```
 */
export class InvalidEmailError extends DomainError {
  /**
   * Tạo một instance mới của InvalidEmailError.
   *
   * @param email - Email không hợp lệ
   */
  constructor(email: string) {
    super(
      'INVALID_EMAIL_FORMAT',
      `Invalid email format: ${email}`,
      { email }
    );
  }
}

