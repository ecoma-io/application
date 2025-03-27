export interface IPaymentInitiatedEvent {
  readonly eventType: "PaymentInitiated";
  readonly paymentId: string;
  readonly tenantId: string;
  readonly amount: {
    amount: number;
    currency: string;
  };
  readonly type: "Purchase" | "Renewal" | "AddOn";
  readonly initiatedAt: Date;
  readonly issuedAt: Date;
}
