import { AuditLogEntry, RetentionPolicy } from "@ecoma/alm-domain";
import {
  CusorBasedPaginatedDTO,
  OffsetBasedPaginatedDTO,
} from "@ecoma/common-application";
import { AuditLogQueryDto, RetentionPolicyQueryDto } from "../dto";
import { GetAuditLogsQueryHandler } from "../use-cases/query/get-audit-logs.query.handler";
import { GetRetentionPoliciesQueryHandler } from "../use-cases/query/get-retention-policies.query.handler";

export class AlmQueryApplicationService {
  constructor(
    private readonly getAuditLogsQueryHandler: GetAuditLogsQueryHandler,
    private readonly getRetentionPoliciesQueryHandler: GetRetentionPoliciesQueryHandler
  ) {}

  async queryAuditLogs(
    query: AuditLogQueryDto
  ): Promise<
    | CusorBasedPaginatedDTO<AuditLogEntry>
    | OffsetBasedPaginatedDTO<AuditLogEntry>
  > {
    return this.getAuditLogsQueryHandler.execute(query);
  }

  async queryRetentionPolicies(
    query: RetentionPolicyQueryDto
  ): Promise<
    | CusorBasedPaginatedDTO<RetentionPolicy>
    | OffsetBasedPaginatedDTO<RetentionPolicy>
  > {
    return this.getRetentionPoliciesQueryHandler.execute(query);
  }
}
