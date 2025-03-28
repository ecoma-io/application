import { IQueryHandler, IQuery } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import { INotificationRepository, Notification, StringId } from '@ecoma/ndm-domain';
import { Injectable } from '@nestjs/common';

/**
 * Query để lấy thông tin thông báo theo ID
 */
export class GetNotificationByIdQuery implements IQuery {
  constructor(public readonly id: StringId) {}
  public readonly version: string = '1';
}

/**
 * Query handler để lấy thông tin thông báo theo ID
 */
@Injectable()
export class GetNotificationByIdHandler implements IQueryHandler<GetNotificationByIdQuery, Notification | null> {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý query lấy thông tin thông báo
   * @param query Query chứa ID của thông báo
   * @returns Thông báo hoặc null nếu không tìm thấy
   */
  public async handle(query: GetNotificationByIdQuery): Promise<Notification | null> {
    this.logger.info('Getting notification by ID', { notificationId: query.id });

    const notification = await this.notificationRepository.findById(query.id);

    if (!notification) {
      this.logger.info('Notification not found', { notificationId: query.id });
    }

    return notification;
  }
}
