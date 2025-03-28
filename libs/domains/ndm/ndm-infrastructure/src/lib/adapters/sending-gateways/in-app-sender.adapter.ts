import { Injectable } from '@nestjs/common';
import { ILogger } from '@ecoma/common-application';
import { Channel } from '@ecoma/ndm-domain';
import { INotificationSenderPort } from '@ecoma/ndm-application';

/**
 * Adapter để gửi thông báo trong ứng dụng (In-App)
 */
@Injectable()
export class InAppSenderAdapter implements INotificationSenderPort {
  constructor(private readonly logger: ILogger) {}

  /**
   * Kiểm tra có hỗ trợ kênh gửi thông báo không
   */
  public supportsChannel(channel: Channel): boolean {
    return channel.isInApp();
  }

  /**
   * Gửi thông báo trong ứng dụng
   */
  public async send(recipientId: string, subject: string, content: string): Promise<void> {
    this.logger.debug('Sending In-App notification', {
      recipientId,
      subject
    });

    // TODO: Implement actual In-App notification logic
    // This could involve storing notifications in a database or using a real-time communication service
    await new Promise(resolve => setTimeout(resolve, 500));

    this.logger.debug('In-App notification sent successfully', {
      recipientId,
      subject
    });
  }
}
