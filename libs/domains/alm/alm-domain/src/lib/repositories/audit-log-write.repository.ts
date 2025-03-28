import { IWriteRepository } from "@ecoma/common-domain";
import { AuditLogEntry } from "../aggregates";
import { AuditLogEntryId } from "../value-objects";

/**
 * Interface định nghĩa các phương thức ghi dữ liệu của Audit Log
 * @interface IAuditLogWriteRepository
 * @extends {IWriteRepository<AuditLogEntryId, AuditLogEntry>}
 */
export interface IAuditLogWriteRepository
  extends IWriteRepository<AuditLogEntryId, AuditLogEntry> {
  /**
   * Xóa các audit log entry theo chính sách lưu trữ
   * @param {Date} olderThan - Ngày giới hạn, các entry cũ hơn ngày này sẽ bị xóa
   * @returns {Promise<void>}
   */
  deleteByRetentionPolicy(olderThan: Date): Promise<void>;
}
