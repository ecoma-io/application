/**
 * @fileoverview Các lỗi liên quan đến phân quyền và xác thực
 * @since 1.0.0
 */

import { AbstractApplicationError } from './abstract.error';

export class UnauthorizedError extends AbstractApplicationError {
  constructor(message: string) {
    super(message);
  }
}

export class InsufficientPermissionError extends AbstractApplicationError {
  constructor(
    public readonly requiredPermission: string,
    public readonly userId: string
  ) {
    super(`Người dùng ${userId} không có quyền ${requiredPermission} cần thiết`);
  }
}

export class ResourceAccessDeniedError extends AbstractApplicationError {
  constructor(
    public readonly resourceType: string,
    public readonly resourceId: string,
    public readonly userId: string
  ) {
    super(`Người dùng ${userId} không có quyền truy cập ${resourceType} với ID ${resourceId}`);
  }
}
