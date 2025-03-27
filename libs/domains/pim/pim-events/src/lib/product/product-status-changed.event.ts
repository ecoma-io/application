export interface IProductStatusChangedEvent {
  readonly eventType: "ProductStatusChanged";
  readonly productId: string;
  readonly tenantId: string;
  readonly oldStatus: string;
  readonly newStatus: string;
  readonly changedByUserId: string;
  readonly issuedAt: Date;
}
