/**
 * @fileoverview Interface định nghĩa kết quả validation
 * @since 1.0.0
 */

/**
 * Interface định nghĩa kết quả validation
 */
export interface IValidationResult {
  /**
   * Kiểm tra xem validation có thành công hay không
   * @returns {boolean} True nếu validation thành công
   */
  isValid(): boolean;

  /**
   * Lấy danh sách các lỗi validation
   * @returns {Array<{field: string, message: string, code: string, data?: Record<string, unknown>}>} Danh sách các lỗi validation
   */
  getErrors(): Array<{field: string, message: string, code: string, data?: Record<string, unknown>}>;

  /**
   * Thêm một lỗi validation
   * @param {Object} error - Lỗi cần thêm
   * @param {string} error.field - Tên trường bị lỗi
   * @param {string} error.message - Thông báo lỗi
   * @param {string} error.code - Mã lỗi
   * @param {Object} [error.data] - Dữ liệu bổ sung
   */
  addError(error: {field: string, message: string, code: string, data?: Record<string, unknown>}): void;

  /**
   * Thêm nhiều lỗi validation
   * @param {Array<{field: string, message: string, code: string, data?: Record<string, unknown>}>} errors - Danh sách lỗi cần thêm
   */
  addErrors(errors: Array<{field: string, message: string, code: string, data?: Record<string, unknown>}>): void;

  /**
   * Xóa tất cả các lỗi validation
   */
  clearErrors(): void;
}
