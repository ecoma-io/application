export interface ITemplateUpdatedEvent {
  readonly eventType: "TemplateUpdated";
  readonly templateId: string;
  readonly tenantId?: string;
  readonly name: string;
  readonly type: "Email" | "SMS" | "Push";
  readonly defaultLocale: string;
  readonly issuedAt: Date;
}
