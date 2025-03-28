/**
 * Đại diện cho trạng thái của người dùng trong hệ thống.
 * 
 * @since 1.0.0
 */
export enum UserStatus {
  /**
   * Tài khoản người dùng đang hoạt động bình thường
   */
  ACTIVE = 'Active',

  /**
   * Tài khoản người dùng đã bị vô hiệu hóa
   */
  INACTIVE = 'Inactive',

  /**
   * Tài khoản người dùng đang chờ xác nhận email
   */
  PENDING_CONFIRMATION = 'PendingConfirmation',

  /**
   * Tài khoản người dùng đã yêu cầu đặt lại mật khẩu
   */
  PASSWORD_RESET_REQUESTED = 'PasswordResetRequested'
} 