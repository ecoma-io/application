export interface IBillingTransactionInitiatedEvent {
  readonly eventType: "BillingTransactionInitiated";
  readonly billingTransactionId: string;
  readonly tenantId: string;
  readonly subscriptionId: string;
  readonly amount: {
    amount: number;
    currency: string;
  };
  readonly type: "Purchase" | "Renewal" | "AddOn";
  readonly initiatedAt: Date;
  readonly issuedAt: Date;
}
