/**
 * DTO cho thông tin Membership.
 */
export interface IMembershipDto {
  /**
   * ID của membership.
   */
  id: string;

  /**
   * ID của người dùng.
   */
  userId: string;

  /**
   * ID của tổ chức. Nếu là null, đây là mối quan hệ của người dùng nội bộ Ecoma.
   */
  organizationId?: string;

  /**
   * ID của vai trò được gán cho người dùng trong phạm vi này.
   */
  roleId: string;

  /**
   * Thời điểm người dùng bắt đầu mối quan hệ này.
   */
  joinedAt: Date;
} 