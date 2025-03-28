import { AbstractDomainEvent } from '@ecoma/common-domain';

export class AuditLogRetentionAppliedEvent extends AbstractDomainEvent {
  constructor(
    public readonly dataSetName: string | null,
    public readonly numberOfRecordsDeleted: number,
    public readonly appliedAt: Date,
    timestamp?: Date,
    metadata?: Record<string, unknown>,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
