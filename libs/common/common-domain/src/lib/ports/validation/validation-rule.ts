/**
 * @fileoverview Interface định nghĩa quy tắc validation
 * @since 1.0.0
 */

/**
 * Interface định nghĩa quy tắc validation
 */
export interface IValidationRule<T> {
  /**
   * Kiểm tra xem giá trị có thỏa mãn quy tắc validation hay không
   * @param {T} value - Giá trị cần kiểm tra
   * @returns {Object | null} Lỗi validation nếu có, null nếu không có lỗi
   */
  validate(value: T): {field: string, message: string, code: string, data?: Record<string, unknown>} | null;

  /**
   * Lấy tên của quy tắc validation
   * @returns {string} Tên quy tắc validation
   */
  getName(): string;

  /**
   * Lấy mô tả của quy tắc validation
   * @returns {string} Mô tả quy tắc validation
   */
  getDescription(): string;
}
