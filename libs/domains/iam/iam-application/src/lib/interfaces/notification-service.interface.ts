/**
 * Interface cho dịch vụ gửi thông báo thông qua NDM Bounded Context.
 */
export interface INotificationService {
  /**
   * Gửi email xác minh đăng ký.
   * @param email - Email người nhận
   * @param verificationToken - Token xác minh
   * @param locale - Mã locale của người dùng để bản địa hóa nội dung
   * @returns Promise<void>
   */
  sendVerificationEmail(email: string, verificationToken: string, locale: string): Promise<void>;

  /**
   * Gửi email đặt lại mật khẩu.
   * @param email - Email người nhận
   * @param resetToken - Token đặt lại mật khẩu
   * @param locale - Mã locale của người dùng để bản địa hóa nội dung
   * @returns Promise<void>
   */
  sendPasswordResetEmail(email: string, resetToken: string, locale: string): Promise<void>;

  /**
   * Gửi email thông báo lời mời tham gia tổ chức.
   * @param email - Email người nhận
   * @param invitationToken - Token lời mời
   * @param organizationName - Tên tổ chức mời
   * @param inviterName - Tên người mời
   * @param locale - Mã locale của người dùng để bản địa hóa nội dung
   * @returns Promise<void>
   */
  sendOrganizationInvitationEmail(
    email: string, 
    invitationToken: string, 
    organizationName: string, 
    inviterName: string, 
    locale: string
  ): Promise<void>;
} 