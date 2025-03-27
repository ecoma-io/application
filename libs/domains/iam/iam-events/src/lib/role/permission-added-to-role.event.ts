export interface IPermissionAddedToRoleEvent {
  readonly eventType: "PermissionAddedToRole";
  readonly roleId: string;
  readonly permissionValue: string;
  readonly issuedAt: Date;
}
