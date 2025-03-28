import { IamApplicationError } from './iam-application-error';

/**
 * Lớp lỗi cho User.
 */
export class UserError extends IamApplicationError {
  /**
   * Tạo một lỗi User mới.
   * @param message - Thông báo lỗi
   * @param statusCode - Mã HTTP nếu liên quan đến HTTP (mặc định là 400)
   */
  constructor(message: string, statusCode = 400) {
    super(message, 'USER_ERROR', statusCode);
    this.name = 'UserError';
  }
}

/**
 * Lớp lỗi cho email đã tồn tại.
 */
export class EmailAlreadyExistsError extends UserError {
  /**
   * Tạo một lỗi email đã tồn tại mới.
   * @param email - Email đã tồn tại
   */
  constructor(email: string) {
    super(`Email ${email} đã tồn tại`);
    this.name = 'EmailAlreadyExistsError';
  }
}

/**
 * Lớp lỗi cho không tìm thấy người dùng.
 */
export class UserNotFoundError extends UserError {
  /**
   * Tạo một lỗi không tìm thấy người dùng mới.
   * @param identifier - Định danh người dùng (ID, email, v.v.)
   */
  constructor(identifier?: string) {
    super(
      identifier
        ? `Không tìm thấy người dùng với định danh: ${identifier}`
        : 'Không tìm thấy người dùng',
      404  // Pass the 404 status code to the parent constructor
    );
    this.name = 'UserNotFoundError';
  }
}

/**
 * Lớp lỗi cho token xác minh email không hợp lệ.
 */
export class InvalidEmailVerificationTokenError extends UserError {
  /**
   * Tạo một lỗi token xác minh email không hợp lệ mới.
   */
  constructor() {
    super('Token xác minh email không hợp lệ hoặc đã hết hạn');
    this.name = 'InvalidEmailVerificationTokenError';
  }
}

/**
 * Lớp lỗi cho token đặt lại mật khẩu không hợp lệ.
 */
export class InvalidPasswordResetTokenError extends UserError {
  /**
   * Tạo một lỗi token đặt lại mật khẩu không hợp lệ mới.
   */
  constructor() {
    super('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
    this.name = 'InvalidPasswordResetTokenError';
  }
}

/**
 * Lỗi khi token xác thực không hợp lệ
 */
export class InvalidVerificationTokenError extends UserError {
  constructor(reason?: string) {
    const message = reason
      ? `Verification token is invalid: ${reason}`
      : 'Verification token is invalid';
    super(message);
  }
}

/**
 * Lỗi khi quá trình xác thực thất bại
 */
export class VerificationFailedError extends UserError {
  constructor(reason?: string) {
    const message = reason
      ? `Verification failed: ${reason}`
      : 'Verification failed';
    super(message);
  }
}

/**
 * Lỗi khi người dùng không còn kích hoạt/active
 */
export class UserNotActiveError extends UserError {
  constructor(userId: string) {
    super(`User with id ${userId} is not active`);
  }
}

/**
 * Lỗi khi token đặt lại mật khẩu không hợp lệ
 */
export class InvalidResetTokenError extends UserError {
  constructor(reason?: string) {
    const message = reason
      ? `Password reset token is invalid: ${reason}`
      : 'Password reset token is invalid';
    super(message);
  }
}

/**
 * Lỗi khi quá trình đặt lại mật khẩu thất bại
 */
export class PasswordResetFailedError extends UserError {
  constructor(reason?: string) {
    const message = reason
      ? `Password reset failed: ${reason}`
      : 'Password reset failed';
    super(message);
  }
}
