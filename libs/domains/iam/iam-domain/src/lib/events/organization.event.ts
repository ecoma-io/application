import {
  AbstractDomainEvent,
  IDomainEventMetadata,
} from "@ecoma/common-domain";

export class OrganizationUpdatedEvent extends AbstractDomainEvent {
  public readonly organizationId: string;
  public readonly name: string;
  public readonly description: string;
  public readonly logoUrl: string;

  constructor(
    organizationId: string,
    name: string,
    description: string,
    logoUrl: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
    this.organizationId = organizationId;
    this.name = name;
    this.description = description;
    this.logoUrl = logoUrl;
  }
}

export class OrganizationSlugUpdatedEvent extends AbstractDomainEvent {
  public readonly organizationId: string;
  public readonly slug: string;

  constructor(
    organizationId: string,
    slug: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
    this.organizationId = organizationId;
    this.slug = slug;
  }
}

export class OrganizationDeactivatedEvent extends AbstractDomainEvent {
  public readonly organizationId: string;

  constructor(
    organizationId: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
    this.organizationId = organizationId;
  }
}

export class OrganizationActivatedEvent extends AbstractDomainEvent {
  public readonly organizationId: string;

  constructor(
    organizationId: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
    this.organizationId = organizationId;
  }
}
