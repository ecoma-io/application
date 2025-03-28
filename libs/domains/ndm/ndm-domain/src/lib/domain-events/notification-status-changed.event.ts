import { AbstractDomainEvent, IDomainEventMetadata } from '@ecoma/common-domain';
import { NotificationStatus } from '../value-objects';

/**
 * Event khi trạng thái thông báo thay đổi
 */
export class NotificationStatusChangedEvent extends AbstractDomainEvent {
  constructor(
    public readonly notificationId: string,
    public readonly oldStatus: NotificationStatus,
    public readonly newStatus: NotificationStatus,
    public readonly failureReason?: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
