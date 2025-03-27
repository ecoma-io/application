export interface INotificationSentEvent {
  readonly eventType: "NotificationSent";
  readonly notificationId: string;
  readonly tenantId?: string;
  readonly templateId: string;
  readonly recipientId: string;
  readonly recipientEmail: string;
  readonly sentAt: Date;
  readonly issuedAt: Date;
}
