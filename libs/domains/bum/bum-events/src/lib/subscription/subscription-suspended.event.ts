export interface ISubscriptionSuspendedEvent {
  readonly eventType: "SubscriptionSuspended";
  readonly subscriptionId: string;
  readonly tenantId: string;
  readonly suspendedDate: Date;
  readonly reason: string;
  readonly dataRetentionEndDate: Date;
  readonly issuedAt: Date;
}
