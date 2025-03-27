export interface IPaymentFailedEvent {
  readonly eventType: "PaymentFailed";
  readonly paymentId: string;
  readonly tenantId: string;
  readonly amount: {
    amount: number;
    currency: string;
  };
  readonly type: "Purchase" | "Renewal" | "AddOn";
  readonly paymentGatewayTransactionId?: string;
  readonly failureReason: string;
  readonly failedAt: Date;
  readonly issuedAt: Date;
}
