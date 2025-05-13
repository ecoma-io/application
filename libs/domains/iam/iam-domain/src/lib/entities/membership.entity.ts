import { AbstractEntity, UuidId } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

export interface IMembershipProps {
  userId: string;
  organizationId?: string; // Optional for internal memberships
  roleId: string;
  joinedAt: Date;
}

export class Membership extends AbstractEntity<UuidId> {
  private readonly _props: IMembershipProps;

  private constructor(props: IMembershipProps, id: UuidId) {
    super(id);
    this._props = props;
  }

  public static create(props: IMembershipProps, id?: UuidId): Membership {
    // Validate at least one organizational context (either internal or specific org)
    Guard.againstNullOrEmpty(props.userId, 'userId');
    Guard.againstNullOrEmpty(props.roleId, 'roleId');
    if (!props.joinedAt) {
      props.joinedAt = new Date();
    }

    return new Membership(props, id || UuidId.create());
  }

  get userId(): string { return this._props.userId; }
  get organizationId(): string | undefined { return this._props.organizationId; }
  get roleId(): string { return this._props.roleId; }
  get joinedAt(): Date { return this._props.joinedAt; }

  public changeRole(newRoleId: string): void {
    Guard.againstNullOrEmpty(newRoleId, 'newRoleId');
    if (this._props.roleId === newRoleId) return;
    // TODO: Consider if a DomainEvent should be emitted here or handled by an Application Service
    // Potentially, changing a role on a membership is a significant event.
    this._props.roleId = newRoleId;
    // this._props.updatedAt = new Date(); // If AbstractEntity has updatedAt
  }

  public isInternalMembership(): boolean {
    return this._props.organizationId === null || this._props.organizationId === undefined;
  }

  public isOrganizationMembership(): boolean {
    return !this.isInternalMembership();
  }
}
