import { IReadRepository } from "@ecoma/common-domain";
import { AuditLogEntry } from "../aggregates";
import { AuditLogEntryId } from "../value-objects";

/**
 * Interface định nghĩa các phương thức đọc dữ liệu của Audit Log
 * @interface IAuditLogReadRepository
 * @extends {IReadRepository<AuditLogEntryId, AuditLogEntry>}
 */
export interface IAuditLogReadRepository
  extends IReadRepository<AuditLogEntryId, AuditLogEntry> {
  /**
   * Tìm các audit log theo tenant ID
   * @param {string} tenantId - ID của tenant
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log
   */
  findByTenantId(tenantId: string): Promise<AuditLogEntry[]>;

  /**
   * Tìm các audit log theo bounded context
   * @param {string} boundedContext - Bounded context cần tìm
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log
   */
  findByBoundedContext(boundedContext: string): Promise<AuditLogEntry[]>;

  /**
   * Tìm các audit log trong khoảng thời gian
   * @param {Date} startDate - Thời gian bắt đầu
   * @param {Date} endDate - Thời gian kết thúc
   * @returns {Promise<AuditLogEntry[]>} Danh sách audit log
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<AuditLogEntry[]>;
}
