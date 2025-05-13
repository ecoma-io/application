import { AuditLogEntry } from "../aggregates/audit-log-entry/audit-log-entry.aggregate";

/**
 * Domain service để làm việc với Audit Log Entries
 *
 * Đây là interface định nghĩa các chức năng nghiệp vụ liên quan đến Audit Log
 */
export interface IAuditLogService {
  /**
   * Lưu một audit log entry mới
   * @param entry Audit log entry cần lưu
   */
  saveAuditLogEntry(entry: AuditLogEntry): Promise<void>;
}
