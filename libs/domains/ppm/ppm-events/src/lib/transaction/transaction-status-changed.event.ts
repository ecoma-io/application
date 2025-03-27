export interface ITransactionStatusChangedEvent {
  readonly eventType: "TransactionStatusChanged";
  readonly transactionId: string;
  readonly tenantId: string;
  readonly oldStatus: "Pending" | "Completed" | "Failed";
  readonly newStatus: "Pending" | "Completed" | "Failed";
  readonly updatedAt: Date;
  readonly issuedAt: Date;
}
