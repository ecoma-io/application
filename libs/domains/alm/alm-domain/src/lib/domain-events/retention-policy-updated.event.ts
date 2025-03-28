import { AbstractDomainEvent } from '@ecoma/common-domain';
import { RetentionPolicyId, RetentionRule } from '../value-objects';


export class RetentionPolicyUpdatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly retentionPolicyId: RetentionPolicyId,
    public readonly name: string,
    public readonly description: string,
    public readonly oldRules: RetentionRule[],
    public readonly newRules: RetentionRule[],
    timestamp?: Date,
    metadata?: Record<string, unknown>,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
