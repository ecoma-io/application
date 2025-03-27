export interface IBillingTransactionSuccessfulEvent {
  readonly eventType: "BillingTransactionSuccessful";
  readonly billingTransactionId: string;
  readonly tenantId: string;
  readonly subscriptionId: string;
  readonly amount: {
    amount: number;
    currency: string;
  };
  readonly type: "Purchase" | "Renewal" | "AddOn";
  readonly transactionDate: Date;
  readonly paymentGatewayTransactionId: string;
  readonly invoiceId: string;
  readonly issuedAt: Date;
}
