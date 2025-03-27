import { DomainError } from "@ecoma/common-domain";

/**
 * Đại diện cho lỗi khi không tìm thấy người dùng với ID được chỉ định.
 * @extends {DomainError}
 */
export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super("User {userId} not found", { userId });
  }
}

/**
 * Đại diện cho lỗi khi email đã được sử dụng bởi người dùng khác.
 * @extends {DomainError}
 */
export class EmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super("Email {email} is already in use", { email });
  }
}

/**
 * Đại diện cho lỗi khi địa chỉ email không đúng định dạng.
 * @extends {DomainError}
 */
export class InvalidEmailError extends DomainError {
  constructor(email: string) {
    super("Invalid email address {email}", { email });
  }
}

/**
 * Đại diện cho lỗi khi không tìm thấy vai trò với ID được chỉ định.
 * @extends {DomainError}
 */
export class RoleNotFoundError extends DomainError {
  constructor(roleId: string) {
    super("Role {roleId} not found", { roleId });
  }
}

/**
 * Đại diện cho lỗi khi vai trò không phù hợp với phạm vi yêu cầu.
 * @extends {DomainError}
 */
export class InvalidRoleScopeError extends DomainError {
  constructor(roleId: string, expectedScope: string) {
    super("Role {roleId} is not valid for scope {expectedScope}", {
      roleId,
      expectedScope,
    });
  }
}

/**
 * Đại diện cho lỗi khi không tìm thấy quyền hạn với giá trị được chỉ định.
 * @extends {DomainError}
 */
export class PermissionNotFoundError extends DomainError {
  constructor(permissionValue: string) {
    super("Permission {permissionValue} not found", { permissionValue });
  }
}

/**
 * Đại diện cho lỗi khi quyền hạn không phù hợp với phạm vi yêu cầu.
 * @extends {DomainError}
 */
export class InvalidPermissionScopeError extends DomainError {
  constructor(permissionValue: string, expectedScope: string) {
    super(
      "Permission {permissionValue} is not valid for scope {expectedScope}",
      { permissionValue, expectedScope }
    );
  }
}

/**
 * Đại diện cho lỗi khi mã locale không được hỗ trợ.
 * @extends {DomainError}
 */
export class InvalidLocaleError extends DomainError {
  constructor(locale: string) {
    super("Invalid locale {locale}", { locale });
  }
}
