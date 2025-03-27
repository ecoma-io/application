/**
 * @fileoverview Interface định nghĩa các phương thức bảo mật
 * @since 1.0.0
 */

/**
 * Interface định nghĩa các phương thức bảo mật
 */
export interface ISecurity {
  /**
   * Tạo một token JWT
   * @param {Object} payload - Dữ liệu cần mã hóa trong token
   * @param {Object} [options] - Các tùy chọn bổ sung
   * @returns {Promise<string>} Token JWT
   * @throws {SecurityError} Nếu quá trình tạo token thất bại
   */
  generateToken(payload: Record<string, unknown>, options?: Record<string, unknown>): Promise<string>;

  /**
   * Xác thực một token JWT
   * @param {string} token - Token cần xác thực
   * @returns {Promise<Object>} Dữ liệu đã được giải mã từ token
   * @throws {SecurityError} Nếu token không hợp lệ
   */
  verifyToken(token: string): Promise<Record<string, unknown>>;

  /**
   * Mã hóa một chuỗi mật khẩu
   * @param {string} password - Mật khẩu cần mã hóa
   * @returns {Promise<string>} Mật khẩu đã được mã hóa
   * @throws {SecurityError} Nếu quá trình mã hóa thất bại
   */
  hashPassword(password: string): Promise<string>;

  /**
   * So sánh một mật khẩu với mật khẩu đã được mã hóa
   * @param {string} password - Mật khẩu cần so sánh
   * @param {string} hashedPassword - Mật khẩu đã được mã hóa
   * @returns {Promise<boolean>} True nếu mật khẩu khớp
   * @throws {SecurityError} Nếu quá trình so sánh thất bại
   */
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
}
