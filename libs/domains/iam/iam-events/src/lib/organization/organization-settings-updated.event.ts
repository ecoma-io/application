export interface IOrganizationSettingsUpdatedEvent {
  readonly eventType: "OrganizationSettingsUpdated";
  readonly tenantId: string;
  readonly detailsOfChanges: {
    name?: string;
    slug?: string;
    logoAssetId?: string;
  };
  readonly issuedAt: Date;
}
