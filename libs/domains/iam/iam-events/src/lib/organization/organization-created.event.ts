export interface IOrganizationCreatedEvent {
  readonly eventType: "OrganizationCreated";
  readonly tenantId: string;
  readonly name: string;
  readonly slug: string;
  readonly ownerUserId: string;
  readonly issuedAt: Date;
}
