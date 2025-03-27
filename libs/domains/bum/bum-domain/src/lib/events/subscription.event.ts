import {
  AbstractDomainEvent,
  IDomainEventMetadata,
} from "@ecoma/common-domain";

export class SubscriptionPlanChangedEvent extends AbstractDomainEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly organizationId: string,
    public readonly planId: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class SubscriptionSuspendedEvent extends AbstractDomainEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly organizationId: string,
    public readonly reason: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class SubscriptionActivatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly organizationId: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class SubscriptionCancelledEvent extends AbstractDomainEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly organizationId: string,
    public readonly reason: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class SubscriptionRenewedEvent extends AbstractDomainEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly organizationId: string,
    public readonly startAt: Date,
    public readonly endAt: Date,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class SubscriptionExpiredEvent extends AbstractDomainEvent {
  constructor(
    public readonly subscriptionId: string,
    public readonly organizationId: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
