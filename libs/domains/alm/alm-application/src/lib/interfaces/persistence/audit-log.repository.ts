/**
 * @fileoverview Interface định nghĩa các phương thức tương tác với kho lưu trữ audit log
 * @since 1.0.0
 */

import { AuditLogEntry, AuditLogQueryCriteria } from '@ecoma/alm-domain';

/**
 * Interface định nghĩa các phương thức tương tác với kho lưu trữ audit log
 */
export interface IAuditLogRepository {
  /**
   * Lưu trữ một audit log entry
   * @param {AuditLogEntry} entry - Audit log entry cần lưu trữ
   * @returns {Promise<void>}
   */
  save(entry: AuditLogEntry): Promise<void>;

  /**
   * Lưu trữ một bản ghi audit log mới
   * @param auditLogEntry Bản ghi audit log cần lưu trữ
   * @returns Promise<void>
   */
  persist(auditLogEntry: AuditLogEntry): Promise<void>;

  /**
   * Tìm kiếm các bản ghi audit log theo tiêu chí
   * @param criteria Tiêu chí tìm kiếm
   * @returns Promise<AuditLogEntry[]> Danh sách các bản ghi audit log thỏa mãn tiêu chí
   */
  find(criteria: AuditLogQueryCriteria): Promise<AuditLogEntry[]>;

  /**
   * Xóa các bản ghi audit log cũ dựa trên chính sách retention
   * @param beforeDate Ngày giới hạn, xóa các bản ghi cũ hơn ngày này
   * @param criteria Tiêu chí bổ sung để lọc bản ghi cần xóa (optional)
   * @returns Promise<number> Số lượng bản ghi đã xóa
   */
  deleteExpiredLogs(beforeDate: Date, criteria?: AuditLogQueryCriteria): Promise<number>;

  /**
   * Tìm kiếm audit log theo tiêu chí
   * @param {AuditLogQueryCriteria} criteria - Tiêu chí tìm kiếm
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log thỏa mãn tiêu chí
   */
  findByCriteria(criteria: AuditLogQueryCriteria): Promise<AuditLogEntry[]>;

  /**
   * Tìm kiếm audit log cũ hơn một thời điểm
   * @param {Date} date - Thời điểm so sánh
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log cũ hơn thời điểm
   */
  findOlderThan(date: Date): Promise<AuditLogEntry[]>;

  /**
   * Xóa nhiều audit log theo danh sách ID
   * @param {string[]} ids - Danh sách ID cần xóa
   * @returns {Promise<void>}
   */
  deleteMany(ids: string[]): Promise<void>;
}
