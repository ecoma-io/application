import { Maybe } from "@ecoma/common-types";
import { AuditLogEntry } from "../../aggregates/audit-log-entry/audit-log-entry.aggregate";
import { AuditLogQueryCriteria } from "../../value-objects/audit-log-query-criteria/audit-log-query-criteria.vo";

/**
 * Port định nghĩa các thao tác repository cho AuditLogEntry
 */
export interface IAuditLogEntryRepository {
  /**
   * Lưu một AuditLogEntry mới
   * @param auditLogEntry AuditLogEntry cần lưu
   */
  save(auditLogEntry: AuditLogEntry): Promise<void>;

  /**
   * Tìm một AuditLogEntry theo ID
   * @param id ID của AuditLogEntry cần tìm
   */
  findById(id: string): Promise<Maybe<AuditLogEntry>>;

  /**
   * Tìm danh sách AuditLogEntry theo tiêu chí
   * @param criteria Tiêu chí tìm kiếm
   */
  findByCriteria(criteria: AuditLogQueryCriteria): Promise<{
    items: AuditLogEntry[];
    total: number;
  }>;
}
