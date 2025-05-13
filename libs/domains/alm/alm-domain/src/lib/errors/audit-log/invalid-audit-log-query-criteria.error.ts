import { Maybe, Primitive } from "@ecoma/common-types";
import { AuditLogDomainError } from "./audit-log-domain.error";

/**
 * Lỗi khi tạo mới AuditLogQueryCriteria với dữ liệu không hợp lệ
 */
export class InvalidAuditLogQueryCriteriaError extends AuditLogDomainError {
  constructor(message: string, params?: Record<string, Maybe<Primitive>>) {
    super(message, params);
  }
}
