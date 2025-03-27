export interface IPermissionRemovedFromRoleEvent {
  readonly eventType: "PermissionRemovedFromRole";
  readonly roleId: string;
  readonly permissionValue: string;
  readonly issuedAt: Date;
}
