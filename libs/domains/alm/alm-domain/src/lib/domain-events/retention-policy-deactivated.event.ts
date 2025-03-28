import { AbstractDomainEvent } from '@ecoma/common-domain';
import { RetentionPolicyId } from '../value-objects';

export class RetentionPolicyDeactivatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly retentionPolicyId: RetentionPolicyId,
    timestamp?: Date,
    metadata?: Record<string, unknown>,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
