import { Injectable } from '@nestjs/common';
import { ILogger } from '@ecoma/common-application';
import { Channel } from '@ecoma/ndm-domain';
import { INotificationSenderPort } from '@ecoma/ndm-application';

/**
 * Adapter để gửi thông báo qua Push Notification
 */
@Injectable()
export class PushSenderAdapter implements INotificationSenderPort {
  constructor(private readonly logger: ILogger) {}

  /**
   * Kiểm tra có hỗ trợ kênh gửi thông báo không
   */
  public supportsChannel(channel: Channel): boolean {
    return channel.isPush();
  }

  /**
   * Gửi thông báo qua Push Notification
   */
  public async send(recipientId: string, subject: string, content: string): Promise<void> {
    this.logger.debug('Sending Push notification', {
      recipientId,
      subject
    });

    // TODO: Implement actual Push notification logic
    // This would typically involve using a service like Firebase Cloud Messaging, OneSignal, etc.
    await new Promise(resolve => setTimeout(resolve, 800));

    this.logger.debug('Push notification sent successfully', {
      recipientId,
      subject
    });
  }
}
