import {
  AbstractDomainEvent,
  IDomainEventMetadata,
} from "@ecoma/common-domain";

export class UsageRecordUpdatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly recordId: string,
    public readonly organizationId: string,
    public readonly subscriptionId: string,
    public readonly metricId: string,
    public readonly value: number,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class UsageRecordMetadataUpdatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly recordId: string,
    public readonly organizationId: string,
    public readonly subscriptionId: string,
    public readonly metricId: string,
    public readonly metadataValue: Record<string, unknown>,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class UsageRecordTimestampUpdatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly recordId: string,
    public readonly organizationId: string,
    public readonly subscriptionId: string,
    public readonly metricId: string,
    public readonly timestampValue: Date,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
