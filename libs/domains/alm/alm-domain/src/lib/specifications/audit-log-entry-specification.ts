import { IQuerySpecification } from "@ecoma/common-domain";
import { AuditLogEntry } from "../aggregates";

/**
 * Interface định nghĩa tiêu chí tìm kiếm audit log
 */
export interface IAuditLogEntrySpecification extends IQuerySpecification<AuditLogEntry> {
  getFilters(): Array<{field: keyof AuditLogEntry, operator: string, value: unknown}>;
  getSorts(): Array<{field: keyof AuditLogEntry, direction: 'asc' | 'desc'}>;
  getLimit(): number;
  getOffset(): number;
  isSatisfiedBy(entity: AuditLogEntry): boolean;
}
