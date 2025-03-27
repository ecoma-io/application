export interface IDeliverySucceededEvent {
  readonly eventType: "DeliverySucceeded";
  readonly notificationId: string;
  readonly tenantId?: string;
  readonly providerId: string;
  readonly providerMessageId: string;
  readonly deliveredAt: Date;
  readonly issuedAt: Date;
}
