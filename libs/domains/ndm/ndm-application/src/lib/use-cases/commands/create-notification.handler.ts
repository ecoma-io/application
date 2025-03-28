import { ICommandHandler, ICommand } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import {
  INotificationRepository,
  ITemplateRepository,
  Notification,
  NotificationContext,
  TemplateRendererService,
  StringId
} from '@ecoma/ndm-domain';
import { CreateNotificationDto } from '../../dtos';
import { INotificationSenderPort } from '../../interfaces';
import { Injectable } from '@nestjs/common';

/**
 * Command để tạo thông báo mới
 */
export class CreateNotificationCommand implements ICommand {
  constructor(public readonly dto: CreateNotificationDto) {}
  public readonly version: string = '1';
}

/**
 * Command handler để tạo thông báo mới
 */
@Injectable()
export class CreateNotificationHandler implements ICommandHandler<CreateNotificationCommand, string> {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly templateRepository: ITemplateRepository,
    private readonly templateRenderer: TemplateRendererService,
    private readonly notificationSender: INotificationSenderPort,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý command tạo thông báo
   * @param command Command chứa thông tin để tạo thông báo
   * @returns ID của thông báo mới được tạo
   */
  public async handle(command: CreateNotificationCommand): Promise<string> {
    const dto = command.dto;
    this.logger.info('Creating new notification', { templateId: dto.templateId });

    // Tìm template
    const templateId = StringId.create(dto.templateId);
    const template = await this.templateRepository.findById(templateId);
    if (!template) {
      this.logger.error('Template not found', { templateId: dto.templateId });
      throw new Error(`Template not found: ${dto.templateId}`);
    }

    // Kiểm tra template có thể sử dụng không
    if (!template.canBeUsed()) {
      this.logger.error('Template is not active', { templateId: dto.templateId });
      throw new Error(`Template is not active: ${dto.templateId}`);
    }

    // Kiểm tra notification sender có hỗ trợ kênh gửi không
    if (!this.notificationSender.supportsChannel(template.channel)) {
      this.logger.error('Channel not supported', { channel: template.channel.toString() });
      throw new Error(`Channel not supported: ${template.channel.toString()}`);
    }

    // Tạo notification context
    const context = NotificationContext.create(dto.context);

    // Render template
    const { subject, content } = this.templateRenderer.render(template, context);

    // Tạo notification mới
    const notification = new Notification(
      crypto.randomUUID(),
      template.getId(),
      template.channel,
      template.locale,
      context,
      dto.recipientId,
      dto.organizationId,
      subject,
      content,
    );

    // Lưu notification
    await this.notificationRepository.save(notification);

    const notificationId = notification.getId().toString();
    this.logger.info('Notification created successfully', {
      notificationId: notificationId,
      templateId: template.getId().toString(),
      recipientId: dto.recipientId
    });

    return notificationId;
  }
}
