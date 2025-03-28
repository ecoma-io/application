import { Injectable } from '@nestjs/common';
import { ILogger } from '@ecoma/common-application';
import { Channel } from '@ecoma/ndm-domain';
import { INotificationSenderPort } from '@ecoma/ndm-application';

/**
 * Adapter để gửi thông báo qua SMS
 */
@Injectable()
export class SmsSenderAdapter implements INotificationSenderPort {
  constructor(private readonly logger: ILogger) {}

  /**
   * Kiểm tra có hỗ trợ kênh gửi thông báo không
   */
  public supportsChannel(channel: Channel): boolean {
    return channel.isSMS();
  }

  /**
   * Gửi thông báo qua SMS
   */
  public async send(recipientId: string, subject: string, content: string): Promise<void> {
    this.logger.debug('Sending SMS notification', {
      recipientId,
      contentLength: content.length
    });

    // TODO: Implement actual SMS sending logic
    // This is just a placeholder implementation
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.logger.debug('SMS notification sent successfully', {
      recipientId
    });
  }
}
