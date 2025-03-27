export interface INotificationFailedEvent {
  readonly eventType: "NotificationFailed";
  readonly notificationId: string;
  readonly tenantId?: string;
  readonly templateId: string;
  readonly recipientId: string;
  readonly recipientEmail: string;
  readonly failureReason: string;
  readonly failedAt: Date;
  readonly issuedAt: Date;
}
