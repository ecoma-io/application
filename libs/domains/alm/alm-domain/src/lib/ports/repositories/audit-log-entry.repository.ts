import {
  IReadRepository,
  IWriteRepository,
  UuidId,
} from "@ecoma/common-domain";
import { AuditLogEntry } from "../../aggregates/audit-log-entry/audit-log-entry.aggregate";
import { AuditLogQueryCriteria } from "../../value-objects/audit-log-query-criteria/audit-log-query-criteria.vo";

/**
 * Interface định nghĩa kết quả trả về từ phương thức findByCriteria
 */
export interface IAuditLogEntriesResult {
  /** Danh sách bản ghi Audit Log */
  items: AuditLogEntry[];
  /** Tổng số bản ghi thỏa mãn tiêu chí */
  total: number;
}

/**
 * Port định nghĩa các thao tác repository cho AuditLogEntry
 */
export interface IAuditLogEntryRepository
  extends IReadRepository<UuidId, AuditLogEntry>,
    IWriteRepository<UuidId, AuditLogEntry> {
  /**
   * Tìm danh sách AuditLogEntry theo tiêu chí tìm kiếm
   * @param criteria Tiêu chí tìm kiếm
   * @returns Kết quả bao gồm danh sách items và tổng số bản ghi
   */
  findByCriteria(
    criteria: AuditLogQueryCriteria
  ): Promise<IAuditLogEntriesResult>;
}
