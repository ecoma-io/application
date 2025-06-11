import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { OtpNotificationMessageDto } from './notification.dtos';
import { PinoLogger } from '@ecoma/nestjs';
import { EmailService } from '../email/email.service';

/**
 * Service xử lý các thông báo trong hệ thống
 * @class NotificationService
 */
@Injectable()
export class NotificationService {
  private readonly logger = new PinoLogger(NotificationService.name);

  constructor(
    private readonly emailService: EmailService,
  ) { }

  /**
   * Xử lý message OTP từ RabbitMQ và gửi email chứa mã OTP
   * @param {OtpNotificationMessageDto} msg - Message chứa thông tin OTP và email người nhận
   * @returns {Promise<void>}
   * @throws {Error} Khi không tìm thấy template hoặc có lỗi trong quá trình gửi email
   */
  @RabbitSubscribe({
    exchange: 'notification',
    routingKey: 'otp',
    queue: 'otp-email',
  })
  async handleOtpMessage(msg: OtpNotificationMessageDto): Promise<void> {
    this.logger.info(`Processing OTP notification for email: ${msg.email}`);
    this.logger.debug(`Received otp notification message: ${JSON.stringify(msg)}`);

    try {

      // 3. Send email
      await this.emailService.sendMail('otp-email', msg, msg.email, 'OTP');
    } catch (error) {
      this.logger.error(`Failed to process OTP notification for ${msg.email}`, error);
    }
  }







}
