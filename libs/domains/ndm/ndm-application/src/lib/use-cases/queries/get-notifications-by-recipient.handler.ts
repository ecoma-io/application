import { IQueryHandler, IQuery } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import { INotificationRepository, Notification } from '@ecoma/ndm-domain';
import { Injectable } from '@nestjs/common';

/**
 * Query để lấy danh sách thông báo của một người nhận
 */
export class GetNotificationsByRecipientQuery implements IQuery {
  constructor(public readonly recipientId: string) {}
  public readonly version: string = '1';
}

/**
 * Query handler để lấy danh sách thông báo của một người nhận
 */
@Injectable()
export class GetNotificationsByRecipientHandler implements IQueryHandler<GetNotificationsByRecipientQuery, Notification[]> {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý query lấy danh sách thông báo
   * @param query Query chứa ID của người nhận
   * @returns Danh sách thông báo
   */
  public async handle(query: GetNotificationsByRecipientQuery): Promise<Notification[]> {
    this.logger.info('Getting notifications by recipient', { recipientId: query.recipientId });

    const notifications = await this.notificationRepository.findByRecipientId(query.recipientId);

    this.logger.info('Found notifications', {
      recipientId: query.recipientId,
      count: notifications.length
    });

    return notifications;
  }
}
