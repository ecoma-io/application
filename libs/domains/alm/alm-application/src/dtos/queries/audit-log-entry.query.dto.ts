export class AuditLogEntryQueryDto {
  id!: string;
  eventId?: string;
  timestamp!: string;
  initiator!: {
    type: string;
    id?: string;
    name?: string;
  };
  boundedContext!: string;
  actionType!: string;
  category?: string;
  severity?: string;
  entityId?: string;
  entityType?: string;
  tenantId?: string;
  contextData?: Record<string, any>;
  status!: string;
  failureReason?: string;
  createdAt!: string;
}
