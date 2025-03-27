import {
  AbstractDomainEvent,
  IDomainEventMetadata,
} from "@ecoma/common-domain";

import { InvoiceItem } from "../value-objects/invoice-item.value-object";

export class InvoiceItemAddedEvent extends AbstractDomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly item: InvoiceItem,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class InvoiceItemRemovedEvent extends AbstractDomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly item: InvoiceItem,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class InvoiceMarkedAsPendingEvent extends AbstractDomainEvent {
  constructor(
    public readonly invoiceId: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class InvoiceMarkedAsPaidEvent extends AbstractDomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly paidAt: Date,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class InvoiceCancelledEvent extends AbstractDomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly cancelledAt: Date,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class InvoiceMarkedAsRefundedEvent extends AbstractDomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly refundedAt: Date,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}

export class InvoiceMetadataUpdatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly metadataValue: Record<string, unknown>,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
