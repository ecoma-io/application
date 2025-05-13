import { AbstractAggregate, AbstractDomainEvent, UuidId } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';
import { RoleScope, RoleScopeValues } from '../value-objects/role-scope.vo';
import { Permission } from '../value-objects/permission.vo';

export interface IRoleProps {
  name: string;
  description?: string;
  scope: RoleScope;
  organizationId?: string;
  permissions: Permission[];
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Role extends AbstractAggregate<UuidId> {
  private readonly _props: IRoleProps;

  private constructor(props: IRoleProps, id: UuidId) {
    super(id);
    this._props = props;
  }

  public static create(props: {
    name: string;
    description?: string;
    scope: RoleScope;
    organizationId?: string;
    permissions?: Permission[];
    isSystemRole?: boolean;
  }): Role {
    const now = new Date();
    // Ensure scope and organizationId are consistent
    if (props.scope.value === RoleScopeValues.INTERNAL && props.organizationId) {
      throw new Error('Internal role cannot have an organizationId.'); // Or a specific DomainError
    }
    if (props.scope.value === RoleScopeValues.ORGANIZATION && !props.organizationId) {
      throw new Error('Organization role must have an organizationId.'); // Or a specific DomainError
    }

    return new Role({
      name: props.name,
      description: props.description,
      scope: props.scope,
      organizationId: props.organizationId,
      permissions: props.permissions || [],
      isSystemRole: props.isSystemRole || false,
      createdAt: now,
      updatedAt: now,
    }, UuidId.create());
  }

  get name(): string { return this._props.name; }
  get description(): string | undefined { return this._props.description; }
  get scope(): RoleScope { return this._props.scope; }
  get organizationId(): string | undefined { return this._props.organizationId; }
  get permissions(): Permission[] { return [...this._props.permissions]; } // Return a copy
  get isSystemRole(): boolean { return this._props.isSystemRole; }

  public addPermission(permission: Permission): void {
    Guard.againstNullOrUndefined(permission, 'permission');

    // Optional: Validate permission scope matches role scope
    // if (permission.getScope() !== this.scope.value) {
    //   throw new DomainError('Cannot add permission with mismatched scope to role.');
    // }
    if (this._props.permissions.some(p => p.equals(permission))) {
      return; // Permission already exists
    }
    this._props.permissions.push(permission);
    this._props.updatedAt = new Date();
    // TODO: Add PermissionAddedToRoleEvent
  }

  public removePermission(permission: Permission): void {
    Guard.againstNullOrUndefined(permission, 'permission');
    const initialLength = this._props.permissions.length;
    this._props.permissions = this._props.permissions.filter(p => !p.equals(permission));
    if (this._props.permissions.length < initialLength) {
      this._props.updatedAt = new Date();
      // TODO: Add PermissionRemovedFromRoleEvent
    }
  }

  public updateDetails(name?: string, description?: string | null): void {
    let updated = false;
    if (name !== undefined && name !== this._props.name) {
      Guard.againstNullOrEmpty(name, 'name');
      this._props.name = name;
      updated = true;
    }
    if (description !== undefined) {
      this._props.description = description === null ? undefined : description;
      updated = true;
    }
    if (updated) {
      this._props.updatedAt = new Date();
      // TODO: Add RoleDetailsUpdatedEvent
    }
  }
}
