export interface IVariantStatusChangedEvent {
  readonly eventType: "VariantStatusChanged";
  readonly variantId: string;
  readonly tenantId: string;
  readonly productId: string;
  readonly oldStatus: string;
  readonly newStatus: string;
  readonly changedByUserId: string;
  readonly issuedAt: Date;
}
