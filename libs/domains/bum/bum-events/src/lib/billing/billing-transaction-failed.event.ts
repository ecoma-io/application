export interface IBillingTransactionFailedEvent {
  readonly eventType: "BillingTransactionFailed";
  readonly billingTransactionId: string;
  readonly tenantId: string;
  readonly subscriptionId: string;
  readonly amount: {
    amount: number;
    currency: string;
  };
  readonly type: "Purchase" | "Renewal" | "AddOn";
  readonly transactionDate: Date;
  readonly paymentGatewayTransactionId?: string;
  readonly errorDetails: string;
  readonly issuedAt: Date;
}
