import {
  AbstractDomainEvent,
  IDomainEventMetadata,
} from "@ecoma/common-domain";

export class PricingPlanUpdatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly planId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly metadataValue: Record<string, unknown>,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class PricingPlanDeactivatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly planId: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class PricingPlanActivatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly planId: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
