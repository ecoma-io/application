/**
 * Đại diện cho trạng thái của tổ chức trong hệ thống.
 * 
 * @since 1.0.0
 */
export enum OrganizationStatus {
  /**
   * Tổ chức đang hoạt động bình thường
   */
  ACTIVE = 'Active',

  /**
   * Tổ chức đã bị tạm ngưng do hết hạn hoặc vi phạm điều khoản
   */
  SUSPENDED = 'Suspended'
} 