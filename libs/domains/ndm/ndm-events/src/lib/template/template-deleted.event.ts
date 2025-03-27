export interface ITemplateDeletedEvent {
  readonly eventType: "TemplateDeleted";
  readonly templateId: string;
  readonly tenantId?: string;
  readonly issuedAt: Date;
}
