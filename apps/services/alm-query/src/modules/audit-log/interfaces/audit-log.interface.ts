/**
 * Interface định nghĩa cấu trúc dữ liệu của một bản ghi audit log
 */
export interface IAuditLog {
  id: string;
  timestamp: Date;
  initiator: {
    type: string;
    id?: string;
    name: string;
  };
  boundedContext: string;
  actionType: string;
  category?: string;
  severity?: string;
  entityId?: string;
  entityType?: string;
  tenantId?: string;
  contextData?: Record<string, unknown>;
  status: string;
  failureReason?: string;
  eventId?: string;
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
