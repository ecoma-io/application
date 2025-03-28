import { ICommandHandler, ICommand } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import { INotificationRepository, StringId } from '@ecoma/ndm-domain';
import { INotificationSenderPort } from '../../interfaces';
import { Injectable } from '@nestjs/common';

/**
 * Command để gửi thông báo
 */
export class SendNotificationCommand implements ICommand {
  constructor(public readonly notificationId: string) {}
  public readonly version: string = '1';
}

/**
 * Command handler để gửi thông báo
 */
@Injectable()
export class SendNotificationHandler implements ICommandHandler<SendNotificationCommand, void> {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly notificationSender: INotificationSenderPort,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý command gửi thông báo
   * @param command Command chứa ID của thông báo cần gửi
   */
  public async handle(command: SendNotificationCommand): Promise<void> {
    const notificationId = command.notificationId;
    this.logger.info('Sending notification', { notificationId });

    // Tìm notification
    const notificationIdVO = StringId.create(notificationId);
    const notification = await this.notificationRepository.findById(notificationIdVO);
    if (!notification) {
      this.logger.error('Notification not found', { notificationId });
      throw new Error(`Notification not found: ${notificationId}`);
    }

    // Kiểm tra notification sender có hỗ trợ kênh gửi không
    if (!this.notificationSender.supportsChannel(notification.channel)) {
      this.logger.error('Channel not supported', { channel: notification.channel.toString() });
      throw new Error(`Channel not supported: ${notification.channel.toString()}`);
    }

    try {
      // Gửi notification
      await this.notificationSender.send(
        notification.channel,
        notification.recipientId,
        notification.subject,
        notification.content,
      );

      // Cập nhật trạng thái đã gửi
      notification.markAsSent();
      await this.notificationRepository.save(notification);

      this.logger.info('Notification sent successfully', { notificationId });
    } catch (error) {
      // Ghi log lỗi
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      this.logger.error('Failed to send notification', {
        notificationId,
        error: errorMessage
      });

      // Cập nhật trạng thái gửi thất bại
      notification.markAsFailed(errorMessage);
      await this.notificationRepository.save(notification);

      // Ném lại lỗi
      throw new Error(`Failed to send notification: ${errorMessage}`);
    }
  }
}
