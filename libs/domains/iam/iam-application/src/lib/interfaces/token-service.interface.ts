/**
 * Payload chứa trong token xác thực.
 */
export interface ITokenPayload {
  /**
   * ID người dùng.
   */
  userId: string;

  /**
   * ID tổ chức (nếu có).
   */
  organizationId?: string;

  /**
   * Tham số bổ sung khác có thể được thêm vào token.
   */
  [key: string]: unknown;
}

/**
 * Kết quả của việc tạo token.
 */
export interface ITokenResult {
  /**
   * Token được tạo.
   */
  token: string;

  /**
   * Thời điểm hết hạn của token.
   */
  expiresAt: Date;
}

/**
 * Interface cho dịch vụ quản lý token.
 */
export interface ITokenService {
  /**
   * Tạo một token mới dựa trên payload.
   * @param payload - Dữ liệu cần nhúng vào token
   * @param expiresInSeconds - Thời gian sống của token (giây)
   * @returns TokenResult - Kết quả chứa token và thời gian hết hạn
   */
  generateToken(payload: ITokenPayload, expiresInSeconds?: number): Promise<ITokenResult>;

  /**
   * Xác minh và giải mã token.
   * @param token - Token cần xác minh
   * @returns TokenPayload - Payload từ token nếu hợp lệ
   * @throws InvalidTokenError - Nếu token không hợp lệ hoặc đã hết hạn
   */
  verifyToken(token: string): Promise<ITokenPayload>;
} 