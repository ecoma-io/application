import { AbstractEntity, AbstractId } from "@ecoma/common-domain";

/**
 * Invitation status in the system.
 */
export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

interface IOrganizationInvitationProps {
  id: AbstractId;
  organizationId: string;
  email: string;
  roleId: string;
  status: InvitationStatus;
  invitedBy: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt: Date | null;
  acceptedBy: string | null;
}

/**
 * Represents an invitation to join an organization.
 */
export class OrganizationInvitation extends AbstractEntity<
  AbstractId,
  IOrganizationInvitationProps
> {
  constructor(
    id: AbstractId,
    organizationId: string,
    email: string,
    roleId: string,
    invitedBy: string,
    expiresAt: Date,
    status: InvitationStatus = InvitationStatus.PENDING,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    acceptedAt: Date | null = null,
    acceptedBy: string | null = null
  ) {
    super({
      id,
      organizationId,
      email,
      roleId,
      status,
      invitedBy,
      expiresAt,
      createdAt,
      updatedAt,
      acceptedAt,
      acceptedBy,
    });
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get email(): string {
    return this.props.email;
  }

  get roleId(): string {
    return this.props.roleId;
  }

  get status(): InvitationStatus {
    return this.props.status;
  }

  get invitedBy(): string {
    return this.props.invitedBy;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get acceptedAt(): Date | null {
    return this.props.acceptedAt;
  }

  get acceptedBy(): string | null {
    return this.props.acceptedBy;
  }

  public accept(acceptedBy: string): void {
    if (this.props.status !== InvitationStatus.PENDING) {
      return;
    }

    this.props.status = InvitationStatus.ACCEPTED;
    this.props.acceptedAt = new Date();
    this.props.acceptedBy = acceptedBy;
    this.props.updatedAt = new Date();
    // TODO: Add domain event
  }

  public reject(): void {
    if (this.props.status !== InvitationStatus.PENDING) {
      return;
    }

    this.props.status = InvitationStatus.REJECTED;
    this.props.updatedAt = new Date();
    // TODO: Add domain event
  }

  public expire(): void {
    if (this.props.status !== InvitationStatus.PENDING) {
      return;
    }

    this.props.status = InvitationStatus.EXPIRED;
    this.props.updatedAt = new Date();
    // TODO: Add domain event
  }
}
