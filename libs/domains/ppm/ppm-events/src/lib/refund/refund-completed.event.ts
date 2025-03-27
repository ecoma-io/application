export interface IRefundCompletedEvent {
  readonly eventType: "RefundCompleted";
  readonly refundId: string;
  readonly tenantId: string;
  readonly transactionId: string;
  readonly amount: {
    amount: number;
    currency: string;
  };
  readonly paymentGatewayRefundId: string;
  readonly completedAt: Date;
  readonly issuedAt: Date;
}
