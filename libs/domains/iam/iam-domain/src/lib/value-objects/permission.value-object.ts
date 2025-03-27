import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidPermissionScopeError } from "../errors";

/**
 * Permission scope in the system.
 */
export enum PermissionScope {
  SYSTEM = "SYSTEM",
  ORGANIZATION = "ORGANIZATION",
  PROJECT = "PROJECT",
}

/**
 * Common permission actions.
 */
export enum PermissionAction {
  ADMIN = "admin",
  READ = "read",
  WRITE = "write",
}

interface IPermissionProps {
  value: string;
  name: string;
  description: string;
  scope: PermissionScope;
}

/**
 * Represents a permission in the system.
 */
export class Permission extends AbstractValueObject<IPermissionProps> {
  constructor(
    value: string,
    name: string,
    description: string,
    scope: PermissionScope
  ) {
    if (!Permission.isValidScope(scope)) {
      throw new InvalidPermissionScopeError(
        scope,
        `Invalid permission scope: ${scope}`
      );
    }
    super({ value, name, description, scope });
  }

  get value(): string {
    return this.props.value;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get scope(): PermissionScope {
    return this.props.scope;
  }

  /**
   * Gets the resource part of the permission value.
   */
  get resource(): string {
    return this.props.value.split(":")[0];
  }

  /**
   * Gets the action part of the permission value.
   */
  get action(): string {
    return this.props.value.split(":")[1];
  }

  /**
   * Checks if the permission is a system-level permission.
   */
  get isSystem(): boolean {
    return this.props.scope === PermissionScope.SYSTEM;
  }

  /**
   * Checks if the permission is an organization-level permission.
   */
  get isOrganization(): boolean {
    return this.props.scope === PermissionScope.ORGANIZATION;
  }

  /**
   * Checks if the permission is a project-level permission.
   */
  get isProject(): boolean {
    return this.props.scope === PermissionScope.PROJECT;
  }

  /**
   * Checks if the permission is valid for a given scope.
   */
  isValidForScope(scope: PermissionScope): boolean {
    return this.props.scope === scope;
  }

  /**
   * Validates a permission scope.
   */
  private static isValidScope(scope: string): boolean {
    return Object.values(PermissionScope).includes(scope as PermissionScope);
  }

  /**
   * Checks if this is an admin permission.
   */
  isAdmin(): boolean {
    return this.action === PermissionAction.ADMIN;
  }

  /**
   * Checks if this is a read permission.
   */
  isRead(): boolean {
    return this.action === PermissionAction.READ;
  }

  /**
   * Checks if this is a write permission.
   */
  isWrite(): boolean {
    return this.action === PermissionAction.WRITE;
  }

  /**
   * Checks if this permission implies another permission.
   * Admin permissions imply read and write permissions on the same resource.
   * Parent resource permissions imply permissions on child resources.
   */
  implies(other: Permission): boolean {
    // Different scopes never imply each other
    if (this.scope !== other.scope) {
      return false;
    }

    // Check resource hierarchy
    const thisHierarchy = this.resource.split(".");
    const otherHierarchy = other.resource.split(".");

    // This permission must be for a parent or the same resource
    if (thisHierarchy.length > otherHierarchy.length) {
      return false;
    }

    // Check if the resource hierarchies match up to this permission's length
    for (let i = 0; i < thisHierarchy.length; i++) {
      if (thisHierarchy[i] !== otherHierarchy[i]) {
        return false;
      }
    }

    // Admin implies everything
    if (this.isAdmin()) {
      return true;
    }

    // Write implies read
    if (this.isWrite() && other.isRead()) {
      return true;
    }

    // Otherwise, actions must match exactly
    return this.action === other.action;
  }
}
