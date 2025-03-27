export interface IPaymentCompletedEvent {
  readonly eventType: "PaymentCompleted";
  readonly paymentId: string;
  readonly tenantId: string;
  readonly amount: {
    amount: number;
    currency: string;
  };
  readonly type: "Purchase" | "Renewal" | "AddOn";
  readonly paymentGatewayTransactionId: string;
  readonly completedAt: Date;
  readonly issuedAt: Date;
}
