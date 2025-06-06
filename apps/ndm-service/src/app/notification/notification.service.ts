import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { OtpNotificationMessageDto } from './notification.dtos';
import { EmailService } from './email.service';
import { NotificationTemplateRepository } from '../database/repositories/notification-template.repository';
import { NotificationHistoryRepository } from '../database/repositories/notification-history.repository';
import * as Handlebars from 'handlebars';
import { Types } from 'mongoose';
import { NotificationStatus } from '../database/schemas/notification-history.schema';
import { PinoLogger } from '@ecoma/nestjs';

@Injectable()
export class NotificationService {
  private readonly logger = new PinoLogger(NotificationService.name);
  constructor(
    private readonly emailService: EmailService,
    private readonly templateRepo: NotificationTemplateRepository,
    private readonly historyRepo: NotificationHistoryRepository,
  ) { }

  @RabbitSubscribe({
    exchange: 'notification',
    routingKey: 'otp',
    queue: 'otp-email',
  })
  async handleOtpMessage(msg: OtpNotificationMessageDto) {
    this.logger.info(`Processing OTP notification for email: ${msg.email}`);
    this.logger.debug(`Received message: ${JSON.stringify(msg)}`);
    try {
      // 1. Lấy template nội dung
      this.logger.debug('Fetching otp-email template');
      const templateDoc = await this.templateRepo.findByName('otp-email');
      if (!templateDoc) {
        this.logger.warn('otp-email template not found');
        throw new Error('otp-email template not found');
      }
      this.logger.debug('Successfully fetched otp-email template');
      // 2. Lấy layout từ database
      this.logger.debug('Fetching email layout template');
      const layoutDoc = await this.templateRepo.findByName('email');
      if (!layoutDoc) {
        this.logger.warn('email layout template not found in database');
        throw new Error('email layout template not found in database');
      }
      this.logger.debug('Successfully fetched email layout template');

      const layout = Handlebars.compile(layoutDoc.bodyHtml);
      this.logger.debug('Layout compiled successfully');
      // 3. Render nội dung riêng
      const content = Handlebars.compile(templateDoc.bodyHtml)(msg);
      this.logger.debug(`Content rendered (first 100 chars): ${content.substring(0, 100)}...`);
      // 4. Render layout với {{{body}}}
      const html = layout({ ...msg, body: content, subject: 'Mã xác thực OTP', year: new Date().getFullYear() });
      this.logger.debug(`Final HTML rendered (first 100 chars): ${html.substring(0, 100)}...`);
      // 5. Gửi email
      this.logger.info(`Attempting to send email to: ${msg.email}`);
      await this.emailService.sendMail({
        to: msg.email,
        subject: 'Mã xác thực OTP',
        html,
      });
      this.logger.info('Email sent successfully');
      // 6. Lưu lịch sử gửi
      this.logger.info('Attempting to save history');
      await this.historyRepo.create({
        userId: new Types.ObjectId(msg.userId),
        email: msg.email,
        templateName: 'otp-email',
        notificationType: 'otp',
        status: NotificationStatus.SENT,
        data: msg as unknown as Record<string, unknown>,
        processingAttempts: [{ status: NotificationStatus.SENT, attemptedAt: new Date() }],
      });
      this.logger.info(`OTP email sent and history saved for ${msg.email}`);
    } catch (error) {
      this.logger.error(`Failed to process OTP notification for ${msg.email}`, error);
      // Lưu lịch sử gửi thất bại
      this.logger.debug('Attempting to save failed history');
      await this.historyRepo.create({
        userId: new Types.ObjectId(msg.userId),
        email: msg.email,
        templateName: 'otp-email',
        notificationType: 'otp',
        status: NotificationStatus.FAILED,
        errorMessage: error?.message,
        data: msg as unknown as Record<string, unknown>,
        processingAttempts: [{ status: NotificationStatus.FAILED, attemptedAt: new Date(), errorMessage: error?.message }],
      });
      this.logger.debug('Failed history saved');
    }
  }
}
