import { IamApplicationError } from './iam-application-error';

/**
 * Lớp lỗi cho ủy quyền.
 */
export class AuthorizationError extends IamApplicationError {
  /**
   * Tạo một lỗi ủy quyền mới.
   * @param message - Thông báo lỗi
   */
  constructor(message: string) {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Lớp lỗi cho không có quyền truy cập.
 */
export class AccessDeniedError extends AuthorizationError {
  /**
   * Tạo một lỗi không có quyền truy cập mới.
   * @param permission - Quyền yêu cầu (nếu có)
   */
  constructor(permission?: string) {
    super(
      permission
        ? `Không có quyền cần thiết: ${permission}`
        : 'Không có quyền truy cập vào tài nguyên này'
    );
    this.name = 'AccessDeniedError';
  }
}

/**
 * Lớp lỗi cho tổ chức bị tạm ngưng.
 */
export class OrganizationSuspendedError extends AuthorizationError {
  /**
   * Tạo một lỗi tổ chức bị tạm ngưng mới.
   */
  constructor() {
    super('Tổ chức đã bị tạm ngưng. Vui lòng liên hệ quản trị viên');
    this.name = 'OrganizationSuspendedError';
  }
}

/**
 * Lớp lỗi cho không có quyền lợi tính năng.
 */
export class FeatureNotEntitledError extends AuthorizationError {
  /**
   * Tạo một lỗi không có quyền lợi tính năng mới.
   * @param featureType - Loại tính năng
   */
  constructor(featureType: string) {
    super(`Tổ chức không có quyền lợi cho tính năng: ${featureType}`);
    this.name = 'FeatureNotEntitledError';
  }
}

/**
 * Lớp lỗi cho vượt quá hạn mức tài nguyên.
 */
export class ResourceLimitExceededError extends AuthorizationError {
  /**
   * Tạo một lỗi vượt quá hạn mức tài nguyên mới.
   * @param resourceType - Loại tài nguyên
   * @param limit - Hạn mức
   */
  constructor(resourceType: string, limit: number) {
    super(`Đã vượt quá hạn mức ${resourceType}: ${limit}`);
    this.name = 'ResourceLimitExceededError';
  }
} 