export interface IProductUpdatedEvent {
  readonly eventType: "ProductUpdated";
  readonly productId: string;
  readonly tenantId: string;
  readonly sku: string;
  readonly name: string;
  readonly categoryId?: string;
  readonly updatedByUserId: string;
  readonly issuedAt: Date;
}
