import { AggregateRoot, DomainEvent } from '@ecoma/common-domain'; // Adjust path
import { Guard } from '@ecoma/common-utils'; // Adjust path
import { OrganizationSlug } from '../value-objects/organization-slug.vo';
import { OrganizationStatus } from '../value-objects/organization-status.vo';
import { Membership } from '../entities/membership.entity'; // Assuming Membership object might be held, or just IDs

export interface IOrganizationProps {
  name: string;
  slug: OrganizationSlug;
  status: OrganizationStatus;
  country: string; // Assuming string for now, could be a VO linked to RDM
  logoAssetId?: string;
  memberIds: string[]; // Storing member IDs for simplicity, could be Membership objects
  createdAt: Date;
  updatedAt: Date;
}

export class Organization extends AggregateRoot<IOrganizationProps> {
  private constructor(props: IOrganizationProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: Omit<IOrganizationProps, 'createdAt' | 'updatedAt' | 'status' | 'memberIds'>,
    initialOwnerMembershipId: string, // The first member is the owner
    id?: string,
  ): Organization {
    const now = new Date();
    const org = new Organization({
      ...props,
      status: OrganizationStatus.createActive(),
      memberIds: [initialOwnerMembershipId],
      createdAt: now,
      updatedAt: now,
    }, id);
    // TODO: Add OrganizationCreatedEvent, MemberAddedToOrganizationEvent (for owner)
    // org.apply(new OrganizationCreatedEvent(org.id, props.name, props.slug.value, initialOwnerUserId));
    return org;
  }

  public static hydrate(props: IOrganizationProps, id: string): Organization {
    return new Organization(props, id);
  }

  get name(): string { return this.props.name; }
  get slug(): OrganizationSlug { return this.props.slug; }
  get status(): OrganizationStatus { return this.props.status; }
  get country(): string { return this.props.country; }
  get logoAssetId(): string | undefined { return this.props.logoAssetId; }
  get memberIds(): string[] { return [...this.props.memberIds]; } // Return a copy

  public updateSettings(name?: string, slug?: OrganizationSlug, logoAssetId?: string | null): void {
    let updated = false;
    if (name !== undefined && name !== this.props.name) {
      Guard.againstNullOrEmpty(name, 'name');
      this.props.name = name;
      updated = true;
    }
    if (slug !== undefined && !slug.equals(this.props.slug)) {
      this.props.slug = slug;
      updated = true;
    }
    if (logoAssetId !== undefined) { // null means remove logo
      this.props.logoAssetId = logoAssetId === null ? undefined : logoAssetId;
      updated = true;
    }

    if (updated) {
      this.props.updatedAt = new Date();
      // TODO: Add OrganizationSettingsUpdatedEvent
    }
  }

  public addMember(membershipId: string): void {
    Guard.againstNullOrEmpty(membershipId, 'membershipId');
    if (this.props.memberIds.includes(membershipId)) {
      // Optional: throw DomainError or log, member already exists
      return;
    }
    this.props.memberIds.push(membershipId);
    this.props.updatedAt = new Date();
    // TODO: Add MemberAddedToOrganizationEvent
  }

  public removeMember(membershipId: string): void {
    Guard.againstNullOrEmpty(membershipId, 'membershipId');
    // TODO: Add business rule: Cannot remove last owner, etc. (This might belong in a domain service)
    const initialLength = this.props.memberIds.length;
    this.props.memberIds = this.props.memberIds.filter(id => id !== membershipId);
    if (this.props.memberIds.length < initialLength) {
      this.props.updatedAt = new Date();
      // TODO: Add MemberRemovedFromOrganizationEvent
    }
  }

  // updateMemberRole is more complex as Role is on Membership, not directly on Organization.
  // This might be handled by a domain service or by directly updating the Membership entity
  // and then Org just being aware of its members list if needed for some specific org-level rules.

  public suspend(): void {
    if(this.props.status.is(OrganizationStatus.Values.SUSPENDED)) return;
    this.props.status = OrganizationStatus.createSuspended();
    this.props.updatedAt = new Date();
    // TODO: Add OrganizationStatusChangedEvent (to Suspended)
  }

  public activate(): void {
    if(this.props.status.is(OrganizationStatus.Values.ACTIVE)) return;
    this.props.status = OrganizationStatus.createActive();
    this.props.updatedAt = new Date();
    // TODO: Add OrganizationStatusChangedEvent (to Active)
  }
}
