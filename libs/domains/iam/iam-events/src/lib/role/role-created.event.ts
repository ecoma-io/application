export interface IRoleCreatedEvent {
  readonly eventType: "RoleCreated";
  readonly roleId: string;
  readonly name: string;
  readonly scope: "Internal" | "Organization";
  readonly tenantId?: string;
  readonly issuedAt: Date;
}
