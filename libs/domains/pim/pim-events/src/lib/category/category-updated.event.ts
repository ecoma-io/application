export interface ICategoryUpdatedEvent {
  readonly eventType: "CategoryUpdated";
  readonly categoryId: string;
  readonly tenantId: string;
  readonly name: string;
  readonly parentCategoryId?: string;
  readonly updatedByUserId: string;
  readonly issuedAt: Date;
}
