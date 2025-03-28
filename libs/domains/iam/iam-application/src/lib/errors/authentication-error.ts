import { IamApplicationError } from './iam-application-error';

/**
 * Lớp lỗi cho xác thực.
 */
export class AuthenticationError extends IamApplicationError {
  /**
   * Tạo một lỗi xác thực mới.
   * @param message - Thông báo lỗi
   */
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Lớp lỗi cho thông tin đăng nhập không hợp lệ.
 */
export class InvalidCredentialsError extends AuthenticationError {
  /**
   * Tạo một lỗi thông tin đăng nhập không hợp lệ mới.
   */
  constructor() {
    super('Email hoặc mật khẩu không hợp lệ');
    this.name = 'InvalidCredentialsError';
  }
}

/**
 * Lớp lỗi cho tài khoản bị vô hiệu hóa.
 */
export class AccountDisabledError extends AuthenticationError {
  /**
   * Tạo một lỗi tài khoản bị vô hiệu hóa mới.
   */
  constructor() {
    super('Tài khoản đã bị vô hiệu hóa');
    this.name = 'AccountDisabledError';
  }
}

/**
 * Lớp lỗi cho tài khoản chưa xác minh email.
 */
export class EmailNotVerifiedError extends AuthenticationError {
  /**
   * Tạo một lỗi tài khoản chưa xác minh email mới.
   */
  constructor() {
    super('Email chưa được xác minh. Vui lòng xác minh email trước khi đăng nhập');
    this.name = 'EmailNotVerifiedError';
  }
}

/**
 * Lớp lỗi cho token không hợp lệ.
 */
export class InvalidTokenError extends AuthenticationError {
  /**
   * Tạo một lỗi token không hợp lệ mới.
   * @param tokenType - Loại token (mặc định: 'Authentication')
   */
  constructor(tokenType = 'Authentication') {
    super(`${tokenType} token không hợp lệ hoặc đã hết hạn`);
    this.name = 'InvalidTokenError';
  }
}

/**
 * Lớp lỗi cho phiên làm việc đã hết hạn.
 */
export class SessionExpiredError extends AuthenticationError {
  /**
   * Tạo một lỗi phiên làm việc đã hết hạn mới.
   */
  constructor() {
    super('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại');
    this.name = 'SessionExpiredError';
  }
} 