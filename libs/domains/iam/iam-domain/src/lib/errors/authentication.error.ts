import { DomainError } from "@ecoma/common-domain";

/**
 * Đại diện cho lỗi khi thông tin đăng nhập không hợp lệ.
 * @extends {DomainError}
 */
export class InvalidCredentialsError extends DomainError {
  constructor() {
    super("Invalid credentials");
  }
}

/**
 * Đại diện cho lỗi khi email chưa được xác minh.
 * @extends {DomainError}
 */
export class EmailNotVerifiedError extends DomainError {
  constructor(email: string) {
    super("Email {email} is not verified", { email });
  }
}

/**
 * Đại diện cho lỗi khi token xác minh email không hợp lệ hoặc đã hết hạn.
 * @extends {DomainError}
 */
export class InvalidEmailVerificationTokenError extends DomainError {
  constructor() {
    super("Email verification token is invalid or expired");
  }
}

/**
 * Đại diện cho lỗi khi token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
 * @extends {DomainError}
 */
export class InvalidPasswordResetTokenError extends DomainError {
  constructor() {
    super("Password reset token is invalid or expired");
  }
}

/**
 * Đại diện cho lỗi khi phiên làm việc không hợp lệ hoặc đã hết hạn.
 * @extends {DomainError}
 */
export class InvalidSessionError extends DomainError {
  constructor() {
    super("Session is invalid or expired");
  }
}

/**
 * Đại diện cho lỗi khi tài khoản đã bị vô hiệu hóa.
 * @extends {DomainError}
 */
export class AccountInactiveError extends DomainError {
  constructor() {
    super("Account is inactive");
  }
}

/**
 * Đại diện cho lỗi khi mật khẩu không đáp ứng yêu cầu về độ mạnh.
 * @extends {DomainError}
 */
export class WeakPasswordError extends DomainError {
  constructor() {
    super(
      "Password is too weak. Password must be at least 8 characters long and contain uppercase, lowercase, numbers and special characters"
    );
  }
}
