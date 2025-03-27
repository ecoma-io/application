export interface IRefundFailedEvent {
  readonly eventType: "RefundFailed";
  readonly refundId: string;
  readonly tenantId: string;
  readonly transactionId: string;
  readonly amount: {
    amount: number;
    currency: string;
  };
  readonly failureReason: string;
  readonly failedAt: Date;
  readonly issuedAt: Date;
}
