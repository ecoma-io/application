/**
 * Query để lấy danh sách audit logs theo các tiêu chí
 */
export class GetAuditLogsQuery {
  constructor(
    public readonly tenantId?: string,
    public readonly initiatorType?: string,
    public readonly initiatorId?: string,
    public readonly boundedContext?: string,
    public readonly actionType?: string,
    public readonly category?: string,
    public readonly severity?: string,
    public readonly entityType?: string,
    public readonly entityId?: string,
    public readonly timestampFrom?: Date,
    public readonly timestampTo?: Date,
    public readonly status?: string,
    public readonly pageNumber = 1,
    public readonly pageSize = 10,
    public readonly sortBy = "timestamp",
    public readonly sortOrder: "asc" | "desc" = "desc"
  ) {}
}
