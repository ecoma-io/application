import { AbstractEntity, AbstractId } from "@ecoma/common-domain";

interface IOrganizationMemberProps {
  id: AbstractId;
  organizationId: string;
  userId: string;
  roleId: string;
  isActive: boolean;
  joinedAt: Date;
  lastActiveAt: Date;
}

/**
 * Represents an organization member in the system.
 */
export class OrganizationMember extends AbstractEntity<
  AbstractId,
  IOrganizationMemberProps
> {
  constructor(
    id: AbstractId,
    organizationId: string,
    userId: string,
    roleId: string,
    isActive = true,
    joinedAt: Date = new Date(),
    lastActiveAt: Date = new Date()
  ) {
    super({
      id,
      organizationId,
      userId,
      roleId,
      isActive,
      joinedAt,
      lastActiveAt,
    });
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get roleId(): string {
    return this.props.roleId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get joinedAt(): Date {
    return this.props.joinedAt;
  }

  get lastActiveAt(): Date {
    return this.props.lastActiveAt;
  }

  /**
   * Updates the member's role.
   */
  public updateRole(roleId: string): void {
    this.props.roleId = roleId;
    this.props.lastActiveAt = new Date();
    // TODO: Add domain event
  }

  /**
   * Activates the member.
   */
  public activate(): void {
    if (this.props.isActive) {
      return;
    }

    this.props.isActive = true;
    this.props.lastActiveAt = new Date();
    // TODO: Add domain event
  }

  /**
   * Deactivates the member.
   */
  public deactivate(): void {
    if (!this.props.isActive) {
      return;
    }

    this.props.isActive = false;
    this.props.lastActiveAt = new Date();
    // TODO: Add domain event
  }

  /**
   * Updates the last active timestamp.
   */
  updateLastActive(): void {
    this.props.lastActiveAt = new Date();
  }
}
