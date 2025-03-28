import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '@ecoma/common-application';
import { INotificationRepository, Notification } from '@ecoma/ndm-domain';
import { NotificationEntity } from '../entities';
import { NotificationMapper } from '../mappers';

/**
 * TypeORM implementation của INotificationRepository
 */
@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
    private readonly logger: ILogger,
  ) {}

  /**
   * Tìm thông báo theo ID
   */
  public async findById(id: string): Promise<Notification | null> {
    this.logger.debug('Finding notification by ID', { id });

    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    return NotificationMapper.toDomain(entity);
  }

  /**
   * Lưu thông báo
   */
  public async save(notification: Notification): Promise<Notification> {
    this.logger.debug('Saving notification', { id: notification.id });

    const entity = NotificationMapper.toPersistence(notification);
    const savedEntity = await this.repository.save(entity);

    return NotificationMapper.toDomain(savedEntity);
  }

  /**
   * Tìm các thông báo theo người nhận
   */
  public async findByRecipientId(recipientId: string): Promise<Notification[]> {
    this.logger.debug('Finding notifications by recipient ID', { recipientId });

    const entities = await this.repository.find({ where: { recipientId } });

    return entities.map(entity => NotificationMapper.toDomain(entity));
  }

  /**
   * Tìm các thông báo theo tổ chức
   */
  public async findByOrganizationId(organizationId: string): Promise<Notification[]> {
    this.logger.debug('Finding notifications by organization ID', { organizationId });

    const entities = await this.repository.find({ where: { organizationId } });

    return entities.map(entity => NotificationMapper.toDomain(entity));
  }
}
