/**
 * Interface cho dịch vụ mã hóa và xác minh mật khẩu.
 */
export interface IPasswordService {
  /**
   * Mã hóa mật khẩu.
   * @param password - Mật khẩu cần mã hóa
   * @returns Promise chứa chuỗi mật khẩu đã mã hóa
   */
  hashPassword(password: string): Promise<string>;

  /**
   * Xác minh mật khẩu có khớp với mật khẩu đã mã hóa không.
   * @param password - Mật khẩu cần xác minh
   * @param hashedPassword - Mật khẩu đã mã hóa
   * @returns Promise<boolean> - true nếu mật khẩu khớp, false nếu không
   */
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
} 