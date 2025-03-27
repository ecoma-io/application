export interface IDeliveryFailedEvent {
  readonly eventType: "DeliveryFailed";
  readonly notificationId: string;
  readonly tenantId?: string;
  readonly providerId: string;
  readonly providerMessageId?: string;
  readonly failureReason: string;
  readonly failedAt: Date;
  readonly issuedAt: Date;
}
