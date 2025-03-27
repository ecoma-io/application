/**
 * Command để lưu trữ audit log
 */
export class PersistAuditLogCommand {
  constructor(
    public readonly initiator: {
      type: string;
      id: string;
      name?: string;
    },
    public readonly boundedContext: string,
    public readonly actionType: string,
    public readonly category: string,
    public readonly severity: string,
    public readonly entityType: string,
    public readonly entityId: string,
    public readonly changes: Record<string, unknown>,
    public readonly status: string,
    public readonly issuedAt: Date,
    public readonly tenantId?: string,
    public readonly contextData?: Record<string, unknown>,
    public readonly failureReason?: string,
    public readonly eventId?: string
  ) {}
}
