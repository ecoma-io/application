/**
 * Đại diện cho trạng thái của lời mời tham gia tổ chức.
 * 
 * @since 1.0.0
 */
export enum InvitationStatus {
  /**
   * Lời mời đang chờ phản hồi từ người được mời
   */
  PENDING = 'Pending',

  /**
   * Lời mời đã được chấp nhận
   */
  ACCEPTED = 'Accepted',

  /**
   * Lời mời đã bị từ chối
   */
  DECLINED = 'Declined',

  /**
   * Lời mời đã hết hạn do quá thời gian chờ phản hồi
   */
  EXPIRED = 'Expired',

  /**
   * Lời mời đã bị thu hồi bởi người gửi
   */
  REVOKED = 'Revoked'
} 