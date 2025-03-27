export interface ITransactionCreatedEvent {
  readonly eventType: "TransactionCreated";
  readonly transactionId: string;
  readonly tenantId: string;
  readonly paymentId: string;
  readonly amount: {
    amount: number;
    currency: string;
  };
  readonly type: "Purchase" | "Renewal" | "AddOn";
  readonly status: "Pending" | "Completed" | "Failed";
  readonly createdAt: Date;
  readonly issuedAt: Date;
}
