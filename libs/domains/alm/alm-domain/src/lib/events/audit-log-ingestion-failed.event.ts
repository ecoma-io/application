import { AbstractDomainEvent } from '@ecoma/common-domain';

export class AuditLogIngestionFailedEvent extends AbstractDomainEvent {
  constructor(
    public readonly eventType: string,
    public readonly failureReason: string,
    public readonly receivedAt: Date,
    timestamp?: Date,
    metadata?: Record<string, unknown>,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
