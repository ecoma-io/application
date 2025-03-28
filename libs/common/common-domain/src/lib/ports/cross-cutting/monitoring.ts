/**
 * @fileoverview Interface định nghĩa các phương thức giám sát hệ thống
 * @since 1.0.0
 */

/**
 * Interface định nghĩa các phương thức giám sát hệ thống
 */
export interface IMonitoring {
  /**
   * Ghi nhận một metric
   * @param {string} name - Tên metric
   * @param {number} value - Giá trị metric
   * @param {Object} [tags] - Các tag bổ sung
   */
  recordMetric(name: string, value: number, tags?: Record<string, string>): void;

  /**
   * Ghi nhận thời gian thực thi của một operation
   * @param {string} name - Tên operation
   * @param {Function} operation - Operation cần đo thời gian
   * @param {Object} [tags] - Các tag bổ sung
   * @returns {Promise<T>} Kết quả của operation
   */
  recordTiming<T>(name: string, operation: () => Promise<T>, tags?: Record<string, string>): Promise<T>;

  /**
   * Ghi nhận một event
   * @param {string} name - Tên event
   * @param {Object} [data] - Dữ liệu event
   * @param {Object} [tags] - Các tag bổ sung
   */
  recordEvent(name: string, data?: Record<string, unknown>, tags?: Record<string, string>): void;

  /**
   * Ghi nhận một exception
   * @param {Error} error - Exception cần ghi nhận
   * @param {Object} [context] - Context bổ sung
   * @param {Object} [tags] - Các tag bổ sung
   */
  recordException(error: Error, context?: Record<string, unknown>, tags?: Record<string, string>): void;
}
