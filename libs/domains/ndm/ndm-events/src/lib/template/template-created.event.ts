export interface ITemplateCreatedEvent {
  readonly eventType: "TemplateCreated";
  readonly templateId: string;
  readonly tenantId?: string;
  readonly name: string;
  readonly type: "Email" | "SMS" | "Push";
  readonly defaultLocale: string;
  readonly issuedAt: Date;
}
