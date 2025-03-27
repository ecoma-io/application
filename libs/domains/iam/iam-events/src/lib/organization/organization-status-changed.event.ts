export interface IOrganizationStatusChangedEvent {
  readonly eventType: "OrganizationStatusChanged";
  readonly tenantId: string;
  readonly oldStatus: string;
  readonly newStatus: string;
  readonly issuedAt: Date;
}
