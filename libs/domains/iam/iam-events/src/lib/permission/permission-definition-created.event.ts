export interface IPermissionDefinitionCreatedEvent {
  readonly eventType: "PermissionDefinitionCreated";
  readonly permissionValue: string;
  readonly description: string;
  readonly scope: "Internal" | "Organization";
  readonly parentPermissionId?: string;
  readonly issuedAt: Date;
}
