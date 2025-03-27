export interface IRefundInitiatedEvent {
  readonly eventType: "RefundInitiated";
  readonly refundId: string;
  readonly tenantId: string;
  readonly transactionId: string;
  readonly amount: {
    amount: number;
    currency: string;
  };
  readonly reason: string;
  readonly initiatedAt: Date;
  readonly issuedAt: Date;
}
