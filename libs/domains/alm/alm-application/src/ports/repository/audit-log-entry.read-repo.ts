import {
  AuditLogEntry,
  AuditLogQueryCriteria,
  IAuditLogEntryProps,
} from "@ecoma/alm-domain";
import { IReadRepository, UuidId } from "@ecoma/common-domain";

/**
 * Repository interface cho đọc AuditLogEntry (Query side)
 * @see AuditLogEntry
 */
export interface IAuditLogEntryReadRepo
  extends IReadRepository<UuidId, IAuditLogEntryProps, AuditLogEntry> {
  /**
   * Tìm kiếm audit log theo tiêu chí truy vấn (phân trang, filter)
   */
  findByCriteria(
    criteria: AuditLogQueryCriteria
  ): Promise<{ data: AuditLogEntry[]; total: number }>;
}
