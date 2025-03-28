/**
 * DTO chứa thông tin phiên làm việc.
 * Sử dụng Session Token Stateful để hỗ trợ các tính năng quan trọng:
 * - Vô hiệu hóa phiên từ xa tức thời
 * - Cập nhật quyền theo thời gian thực
 * - Đồng bộ trạng thái tổ chức
 * - Quản lý đa phiên
 */
export interface ISessionInfo {
  /**
   * ID của phiên làm việc.
   */
  id: string;

  /**
   * ID của người dùng.
   */
  userId: string;

  /**
   * ID của tổ chức (nếu phiên làm việc trong phạm vi tổ chức).
   */
  organizationId?: string;

  /**
   * Token phiên làm việc stateful.
   * Lưu trữ trong database để hỗ trợ quản lý tập trung và vô hiệu hóa tức thời.
   */
  token: string;

  /**
   * Thời điểm hết hạn của phiên làm việc.
   */
  expiresAt: Date;

  /**
   * Thời điểm tạo phiên làm việc.
   */
  createdAt: Date;

  /**
   * Thời điểm hoạt động cuối cùng của phiên làm việc.
   * Hỗ trợ tính năng phát hiện phiên không hoạt động.
   */
  lastActiveAt: Date;
}

/**
 * Interface cho dịch vụ quản lý phiên làm việc.
 */
export interface ISessionService {
  /**
   * Tạo phiên làm việc mới.
   * @param userId - ID của người dùng
   * @param organizationId - ID của tổ chức (nếu phiên làm việc trong phạm vi tổ chức)
   * @returns Promise<SessionInfo> - Thông tin phiên làm việc mới
   */
  createSession(userId: string, organizationId?: string): Promise<ISessionInfo>;

  /**
   * Xác minh phiên làm việc.
   * @param token - Token phiên làm việc
   * @returns Promise<SessionInfo> - Thông tin phiên làm việc nếu hợp lệ
   * @throws SessionExpiredError nếu phiên làm việc không hợp lệ hoặc đã hết hạn
   */
  validateSession(token: string): Promise<ISessionInfo>;

  /**
   * Chấm dứt phiên làm việc.
   * @param sessionId - ID phiên làm việc cần chấm dứt
   * @returns Promise<void>
   */
  terminateSession(sessionId: string): Promise<void>;

  /**
   * Chấm dứt tất cả phiên làm việc của người dùng.
   * @param userId - ID của người dùng
   * @returns Promise<number> - Số phiên làm việc đã chấm dứt
   */
  terminateAllUserSessions(userId: string): Promise<number>;

  /**
   * Lấy danh sách phiên làm việc của người dùng.
   * @param userId - ID của người dùng
   * @returns Promise<SessionInfo[]> - Danh sách phiên làm việc
   */
  getUserSessions(userId: string): Promise<ISessionInfo[]>;
}
