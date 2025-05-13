import { AuditLogDomainError } from "./audit-log-domain.error";

/**
 * Lỗi khi không tìm thấy AuditLogEntry
 */
export class AuditLogEntryNotFoundError extends AuditLogDomainError {
  constructor(id: string) {
    super(`Audit log entry with id ${id} not found`);
  }
}
