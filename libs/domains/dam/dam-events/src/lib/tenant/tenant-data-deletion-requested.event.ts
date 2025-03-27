export interface ITenantDataDeletionRequestedEvent {
  readonly eventType: "TenantDataDeletionRequested";
  readonly tenantId: string;
  readonly reason: string;
  readonly requestedAt: Date;
  readonly issuedAt: Date;
}
