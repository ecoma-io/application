import { AbstractAggregate, SnowflakeId } from "@ecoma/common-domain";

import { InvalidOrganizationSlugError } from "../errors";
import {
  OrganizationActivatedEvent,
  OrganizationDeactivatedEvent,
  OrganizationSlugUpdatedEvent,
  OrganizationUpdatedEvent,
} from "../events";

interface IOrganizationProps {
  id: SnowflakeId;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents an organization in the system.
 */
export class Organization extends AbstractAggregate<
  SnowflakeId,
  IOrganizationProps
> {
  constructor(
    id: SnowflakeId,
    name: string,
    slug: string,
    description: string,
    logoUrl: string,
    createdBy: string,
    isActive = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    super({
      id,
      name,
      slug,
      description,
      logoUrl,
      isActive,
      createdBy,
      createdAt,
      updatedAt,
    });
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get description(): string {
    return this.props.description;
  }

  get logoUrl(): string {
    return this.props.logoUrl;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public update(name: string, description: string, logoUrl: string): void {
    this.props.name = name;
    this.props.description = description;
    this.props.logoUrl = logoUrl;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new OrganizationUpdatedEvent(
        this.id.toString(),
        name,
        description,
        logoUrl
      )
    );
  }

  public updateSlug(slug: string): void {
    if (!Organization.isValidSlug(slug)) {
      throw new InvalidOrganizationSlugError(slug);
    }

    this.props.slug = slug;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new OrganizationSlugUpdatedEvent(this.id.toString(), slug)
    );
  }

  public deactivate(): void {
    if (!this.props.isActive) {
      return;
    }

    this.props.isActive = false;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new OrganizationDeactivatedEvent(this.id.toString()));
  }

  public activate(): void {
    if (this.props.isActive) {
      return;
    }

    this.props.isActive = true;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new OrganizationActivatedEvent(this.id.toString()));
  }

  private static isValidSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  }
}
