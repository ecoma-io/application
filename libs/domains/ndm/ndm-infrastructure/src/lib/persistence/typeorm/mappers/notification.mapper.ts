import {
  Notification,
  Channel,
  Locale,
  NotificationContext,
  NotificationStatus
} from '@ecoma/ndm-domain';
import { NotificationEntity } from '../entities';

/**
 * Mapper để chuyển đổi giữa Notification domain model và NotificationEntity
 */
export class NotificationMapper {
  /**
   * Chuyển đổi từ domain model sang persistence model
   */
  public static toPersistence(notification: Notification): NotificationEntity {
    const entity = new NotificationEntity();
    entity.id = notification.id;
    entity.templateId = notification.templateId;
    entity.channel = notification.channel.toString();
    entity.locale = notification.locale.toString();
    entity.context = notification.context.getData();
    entity.recipientId = notification.recipientId;
    entity.organizationId = notification.organizationId;
    entity.status = notification.status.toString();
    entity.subject = notification.subject;
    entity.content = notification.content;
    entity.failureReason = notification.failureReason;
    entity.sentAt = notification.sentAt;
    entity.deliveredAt = notification.deliveredAt;
    entity.readAt = notification.readAt;
    return entity;
  }

  /**
   * Chuyển đổi từ persistence model sang domain model
   */
  public static toDomain(entity: NotificationEntity): Notification {
    const channel = Channel.create(entity.channel);
    const locale = Locale.create(entity.locale);
    const context = NotificationContext.create(entity.context);

    const notification = new Notification(
      entity.id,
      entity.templateId,
      channel,
      locale,
      context,
      entity.recipientId,
      entity.organizationId,
      entity.subject,
      entity.content,
    );

    // Khôi phục trạng thái
    const status = NotificationStatus.create(entity.status);
    switch (status.toString()) {
      case 'Sending':
        notification.markAsSending();
        break;
      case 'Sent':
        notification.markAsSending();
        notification.markAsSent();
        break;
      case 'Failed':
        notification.markAsSending();
        notification.markAsFailed(entity.failureReason || 'Unknown error');
        break;
      case 'Retrying':
        notification.markAsSending();
        notification.markAsFailed(entity.failureReason || 'Unknown error');
        notification.markAsRetrying();
        break;
      case 'Delivered':
        notification.markAsSending();
        notification.markAsSent();
        notification.markAsDelivered();
        break;
      case 'Read':
        notification.markAsSending();
        notification.markAsSent();
        notification.markAsDelivered();
        notification.markAsRead();
        break;
    }

    return notification;
  }
}
