import { Injectable } from '@nestjs/common';
import { ILogger } from '@ecoma/common-application';
import { Channel } from '@ecoma/ndm-domain';
import { INotificationSenderPort } from '@ecoma/ndm-application';

/**
 * Adapter để gửi thông báo qua email
 */
@Injectable()
export class EmailSenderAdapter implements INotificationSenderPort {
  constructor(private readonly logger: ILogger) {}

  /**
   * Kiểm tra có hỗ trợ kênh gửi thông báo không
   */
  public supportsChannel(channel: Channel): boolean {
    return channel.isEmail();
  }

  /**
   * Gửi thông báo qua email
   */
  public async send(recipientId: string, subject: string, content: string): Promise<void> {
    this.logger.debug('Sending email notification', {
      recipientId,
      subject
    });

    // TODO: Implement actual email sending logic
    // This is just a placeholder implementation
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.logger.debug('Email notification sent successfully', {
      recipientId,
      subject
    });
  }
}
