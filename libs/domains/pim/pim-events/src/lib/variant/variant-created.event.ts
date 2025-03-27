export interface IVariantCreatedEvent {
  readonly eventType: "VariantCreated";
  readonly variantId: string;
  readonly tenantId: string;
  readonly productId: string;
  readonly sku: string;
  readonly attributes: Record<string, unknown>;
  readonly createdByUserId: string;
  readonly issuedAt: Date;
}
