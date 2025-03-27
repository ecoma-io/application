import { DomainError } from "@ecoma/common-domain";

/**
 * Đại diện cho lỗi khi người dùng không có quyền thực hiện hành động.
 * @extends {DomainError}
 */
export class UnauthorizedError extends DomainError {
  constructor(permission: string) {
    super("No permission to perform action {permission}", { permission });
  }
}

/**
 * Đại diện cho lỗi khi tổ chức đang trong trạng thái tạm ngưng.
 * @extends {DomainError}
 */
export class OrganizationSuspendedError extends DomainError {
  constructor(organizationId: string) {
    super("Organization {organizationId} is suspended", { organizationId });
  }
}

/**
 * Đại diện cho lỗi khi vượt quá hạn mức sử dụng tài nguyên được cấp.
 * @extends {DomainError}
 */
export class ResourceLimitExceededError extends DomainError<{
  currentUsage: number;
  limit: number;
}> {
  constructor(resourceType: string, currentUsage: number, limit: number) {
    super(
      "Resource limit exceeded for {resourceType}. Current: {currentUsage}, Limit: {limit}",
      { resourceType, currentUsage, limit },
      { currentUsage, limit }
    );
  }
}

/**
 * Đại diện cho lỗi khi tính năng không được hỗ trợ trong gói dịch vụ hiện tại.
 * @extends {DomainError}
 */
export class FeatureNotEntitledError extends DomainError {
  constructor(featureType: string) {
    super(
      "Feature {featureType} is not supported in current subscription plan",
      { featureType }
    );
  }
}

/**
 * Đại diện cho lỗi khi cố gắng xóa Owner cuối cùng của tổ chức.
 * @extends {DomainError}
 */
export class CannotRemoveLastOwnerError extends DomainError {
  constructor(organizationId: string) {
    super("Cannot remove the last owner of organization {organizationId}", {
      organizationId,
    });
  }
}

/**
 * Đại diện cho lỗi khi thời gian tham gia tổ chức chưa đủ để thực hiện hành động.
 * @extends {DomainError}
 */
export class InsufficientMembershipTimeError extends DomainError {
  constructor(requiredDays: number) {
    super(
      "Must be a member for at least {requiredDays} days to perform this action",
      { requiredDays }
    );
  }
}
