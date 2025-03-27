import { DomainError } from "@ecoma/common-domain";

/**
 * Đại diện cho lỗi khi không tìm thấy tổ chức với ID được chỉ định.
 * @extends {DomainError}
 */
export class OrganizationNotFoundError extends DomainError {
  constructor(organizationId: string) {
    super("Organization {organizationId} not found", { organizationId });
  }
}

/**
 * Đại diện cho lỗi khi slug của tổ chức đã được sử dụng bởi tổ chức khác.
 * @extends {DomainError}
 */
export class OrganizationSlugExistsError extends DomainError {
  constructor(slug: string) {
    super("Slug {slug} is already used by another organization", { slug });
  }
}

/**
 * Đại diện cho lỗi khi slug của tổ chức không tuân thủ quy tắc đặt tên.
 * @extends {DomainError}
 */
export class InvalidOrganizationSlugError extends DomainError {
  constructor(slug: string) {
    super(
      "Invalid slug {slug}. Only lowercase letters, numbers and hyphens are allowed",
      { slug }
    );
  }
}

/**
 * Đại diện cho lỗi khi người dùng không phải là thành viên của tổ chức.
 * @extends {DomainError}
 */
export class NotOrganizationMemberError extends DomainError {
  constructor(userId: string, organizationId: string) {
    super("User {userId} is not a member of organization {organizationId}", {
      userId,
      organizationId,
    });
  }
}

/**
 * Đại diện cho lỗi khi người dùng đã là thành viên của tổ chức.
 * @extends {DomainError}
 */
export class AlreadyOrganizationMemberError extends DomainError {
  constructor(userId: string, organizationId: string) {
    super(
      "User {userId} is already a member of organization {organizationId}",
      { userId, organizationId }
    );
  }
}

/**
 * Đại diện cho lỗi khi không tìm thấy lời mời tham gia tổ chức.
 * @extends {DomainError}
 */
export class InvitationNotFoundError extends DomainError {
  constructor(invitationId: string) {
    super("Invitation {invitationId} not found", { invitationId });
  }
}

/**
 * Đại diện cho lỗi khi lời mời tham gia tổ chức đã hết hạn.
 * @extends {DomainError}
 */
export class InvitationExpiredError extends DomainError {
  constructor(invitationId: string) {
    super("Invitation {invitationId} has expired", { invitationId });
  }
}

/**
 * Đại diện cho lỗi khi lời mời tham gia tổ chức đã bị thu hồi.
 * @extends {DomainError}
 */
export class InvitationRevokedError extends DomainError {
  constructor(invitationId: string) {
    super("Invitation {invitationId} has been revoked", { invitationId });
  }
}

/**
 * Đại diện cho lỗi khi lời mời tham gia tổ chức đã được chấp nhận.
 * @extends {DomainError}
 */
export class InvitationAlreadyAcceptedError extends DomainError {
  constructor(invitationId: string) {
    super("Invitation {invitationId} has already been accepted", {
      invitationId,
    });
  }
}
