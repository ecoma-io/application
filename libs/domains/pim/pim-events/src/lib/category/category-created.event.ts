export interface ICategoryCreatedEvent {
  readonly eventType: "CategoryCreated";
  readonly categoryId: string;
  readonly tenantId: string;
  readonly name: string;
  readonly parentCategoryId?: string;
  readonly createdByUserId: string;
  readonly issuedAt: Date;
}
