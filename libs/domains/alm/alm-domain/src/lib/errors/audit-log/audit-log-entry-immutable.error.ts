import { Maybe, Primitive } from "@ecoma/common-types";
import { AuditLogDomainError } from "./audit-log-domain.error";

/**
 * Lỗi khi cố gắng cập nhật AuditLogEntry đã tồn tại
 */
export class AuditLogEntryImmutableError extends AuditLogDomainError {
  constructor(message: string, params?: Record<string, Maybe<Primitive>>) {
    super(`Audit log entries are immutable: ${message}`, params);
  }
}
