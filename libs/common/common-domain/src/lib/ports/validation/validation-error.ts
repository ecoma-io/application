/**
 * @fileoverview Class định nghĩa lỗi validation
 * @since 1.0.0
 */

/**
 * Class định nghĩa lỗi validation
 */
export class ValidationError extends Error {
  /**
   * Tên của trường bị lỗi
   */
  private readonly field: string;

  /**
   * Mã lỗi
   */
  private readonly code: string;

  /**
   * Dữ liệu bổ sung
   */
  private readonly data: Record<string, unknown>;

  /**
   * Tạo một instance mới của ValidationError
   * @param {string} field - Tên trường bị lỗi
   * @param {string} message - Thông báo lỗi
   * @param {string} code - Mã lỗi
   * @param {Object} [data] - Dữ liệu bổ sung
   */
  constructor(field: string, message: string, code: string, data?: Record<string, unknown>) {
    super(message);
    this.field = field;
    this.code = code;
    this.data = data || {};
  }

  /**
   * Lấy tên trường bị lỗi
   * @returns {string} Tên trường bị lỗi
   */
  getField(): string {
    return this.field;
  }

  /**
   * Lấy mã lỗi
   * @returns {string} Mã lỗi
   */
  getCode(): string {
    return this.code;
  }

  /**
   * Lấy dữ liệu bổ sung
   * @returns {Object} Dữ liệu bổ sung
   */
  getData(): Record<string, unknown> {
    return this.data;
  }
}
