export interface INotificationCreatedEvent {
  readonly eventType: "NotificationCreated";
  readonly notificationId: string;
  readonly tenantId?: string;
  readonly templateId: string;
  readonly recipientId: string;
  readonly recipientEmail: string;
  readonly recipientLocale: string;
  readonly data: Record<string, unknown>;
  readonly issuedAt: Date;
}
