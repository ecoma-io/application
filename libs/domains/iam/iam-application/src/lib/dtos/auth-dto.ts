/**
 * DTO chứa kết quả đăng nhập.
 * Sử dụng Session Token Stateful thay vì JWT để hỗ trợ các tính năng:
 * - Vô hiệu hóa phiên từ xa tức thời
 * - Cập nhật quyền theo thời gian thực
 * - Đồng bộ trạng thái tổ chức
 * - Quản lý đa phiên
 */
export class LoginResultDto {
  /**
   * ID của người dùng.
   */
  id!: string;

  /**
   * Email của người dùng.
   */
  email!: string;

  /**
   * Họ của người dùng.
   */
  firstName!: string;

  /**
   * Tên của người dùng.
   */
  lastName!: string;

  /**
   * Mã locale của người dùng.
   */
  locale!: string;

  /**
   * Token phiên làm việc stateful.
   * Lưu trữ trong database để hỗ trợ quản lý tập trung và vô hiệu hóa tức thời.
   */
  sessionToken!: string;

  /**
   * Thời điểm hết hạn của phiên làm việc.
   */
  expiresAt!: Date;

  /**
   * Thời điểm hoạt động cuối cùng của phiên làm việc.
   * Hỗ trợ tính năng phát hiện phiên không hoạt động.
   */
  lastActiveAt!: Date;

  /**
   * ID tổ chức hiện tại (nếu đăng nhập vào phạm vi tổ chức).
   */
  currentOrganizationId?: string;
}

/**
 * DTO cho thông tin token JWT (cho tương thích ngược).
 * Lưu ý: Phiên làm việc sẽ chuyển sang sử dụng Session Token Stateful,
 * JWT chỉ được giữ lại cho tương thích ngược.
 */
export class JwtTokenDto {
  /**
   * Token.
   */
  token!: string;

  /**
   * Thời điểm hết hạn.
   */
  expiresAt!: Date;
}
