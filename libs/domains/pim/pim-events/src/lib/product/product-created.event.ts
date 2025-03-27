export interface IProductCreatedEvent {
  readonly eventType: "ProductCreated";
  readonly productId: string;
  readonly tenantId: string;
  readonly sku: string;
  readonly name: string;
  readonly categoryId?: string;
  readonly createdByUserId: string;
  readonly issuedAt: Date;
}
