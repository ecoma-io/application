export interface ISubscriptionRenewedEvent {
  readonly eventType: "SubscriptionRenewed";
  readonly subscriptionId: string;
  readonly tenantId: string;
  readonly pricingPlanId: string;
  readonly pricingPlanVersion: number;
  readonly newStartDate: Date;
  readonly newEndDate: Date;
  readonly transactionId: string;
  readonly issuedAt: Date;
}
