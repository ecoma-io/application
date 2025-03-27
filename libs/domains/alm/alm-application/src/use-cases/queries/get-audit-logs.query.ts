import { IQuery } from "@ecoma/common-application";
import { GetAuditLogsQueryDto } from "../../dtos/queries/get-audit-logs.query.dto";

/**
 * Query object cho use case get audit logs
 */
export class GetAuditLogsQuery implements IQuery {
  readonly type = "GetAuditLogs";

  constructor(public readonly payload: GetAuditLogsQueryDto) {}
}
