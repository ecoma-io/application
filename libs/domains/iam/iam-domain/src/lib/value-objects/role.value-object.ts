import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidRoleScopeError } from "../errors";

/**
 * Phạm vi của vai trò.
 */
export enum RoleScope {
  SYSTEM = "SYSTEM",
  ORGANIZATION = "ORGANIZATION",
  PROJECT = "PROJECT",
}

/**
 * Thuộc tính của vai trò.
 */
export interface IRoleProps {
  id: string;
  name: string;
  description: string;
  scope: RoleScope;
  permissions: string[];
}

/**
 * Đại diện cho một vai trò trong hệ thống.
 * @extends {AbstractValueObject<IRoleProps>}
 */
export class Role extends AbstractValueObject<IRoleProps> {
  constructor(props: IRoleProps) {
    Role.validate(props);
    super(props);
  }

  /**
   * Kiểm tra tính hợp lệ của vai trò.
   */
  private static validate(props: IRoleProps): void {
    if (!Object.values(RoleScope).includes(props.scope)) {
      throw new InvalidRoleScopeError(props.id, props.scope);
    }
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get scope(): RoleScope {
    return this.props.scope;
  }

  get permissions(): string[] {
    return [...this.props.permissions];
  }

  get isSystem(): boolean {
    return this.props.scope === RoleScope.SYSTEM;
  }

  get isOrganization(): boolean {
    return this.props.scope === RoleScope.ORGANIZATION;
  }

  get isProject(): boolean {
    return this.props.scope === RoleScope.PROJECT;
  }

  /**
   * Kiểm tra xem vai trò có quyền hạn cụ thể không.
   */
  hasPermission(permission: string): boolean {
    return this.props.permissions.includes(permission);
  }

  /**
   * Kiểm tra xem vai trò có tất cả các quyền hạn được chỉ định không.
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  /**
   * Kiểm tra xem vai trò có bất kỳ quyền hạn nào được chỉ định không.
   */
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }
}
