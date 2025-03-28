import { AbstractDomainEvent, IDomainEventMetadata } from '@ecoma/common-domain';
import { Channel, NotificationContext, Locale } from '../value-objects';

/**
 * Event khi tạo một thông báo mới
 */
export class NotificationCreatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly notificationId: string,
    public readonly templateId: string,
    public readonly channel: Channel,
    public readonly locale: Locale,
    public readonly context: NotificationContext,
    public readonly recipientId: string,
    public readonly organizationId: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
