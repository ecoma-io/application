export interface IVariantUpdatedEvent {
  readonly eventType: "VariantUpdated";
  readonly variantId: string;
  readonly tenantId: string;
  readonly productId: string;
  readonly sku: string;
  readonly attributes: Record<string, unknown>;
  readonly updatedByUserId: string;
  readonly issuedAt: Date;
}
