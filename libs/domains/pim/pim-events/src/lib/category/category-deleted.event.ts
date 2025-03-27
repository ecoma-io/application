export interface ICategoryDeletedEvent {
  readonly eventType: "CategoryDeleted";
  readonly categoryId: string;
  readonly tenantId: string;
  readonly deletedByUserId: string;
  readonly issuedAt: Date;
}
