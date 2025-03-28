import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectClientProxy } from '@ecoma/common-infrastructure';
import { INotificationService } from '@ecoma/iam-application';
import { ILogger } from '@ecoma/common-application';
import { Inject } from '@nestjs/common';

/**
 * Triển khai dịch vụ gửi thông báo thông qua NDM Bounded Context.
 */
@Injectable()
export class NotificationService implements INotificationService {
  /**
   * Constructor.
   * @param ndmClient - NATS client để giao tiếp với NDM service
   * @param logger - Logger service
   */
  constructor(
    @InjectClientProxy('NDM')
    private readonly ndmClient: ClientProxy,
    @Inject('ILogger')
    private readonly logger: ILogger
  ) {}

  /**
   * Gửi email xác minh đăng ký.
   * @param email - Email người nhận
   * @param verificationToken - Token xác minh
   * @param locale - Mã locale của người dùng để bản địa hóa nội dung
   * @returns Promise<void>
   */
  async sendVerificationEmail(email: string, verificationToken: string, locale: string): Promise<void> {
    this.logger.info('Gửi email xác minh đăng ký', {
      email,
      locale,
      tokenLength: verificationToken.length
    });

    try {
      // Chuẩn bị URL xác minh
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

      await this.ndmClient.emit('notification.email.verification', {
        recipient: email,
        data: {
          verificationToken,
          verificationUrl
        },
        locale
      }).toPromise();

      this.logger.info('Email xác minh đã được gửi thành công', {
        email,
        locale,
        eventType: 'notification.email.verification'
      });
    } catch (error) {
      this.logger.error('Lỗi khi gửi email xác minh', error as Error, {
        email,
        locale,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Gửi email đặt lại mật khẩu.
   * @param email - Email người nhận
   * @param resetToken - Token đặt lại mật khẩu
   * @param locale - Mã locale của người dùng để bản địa hóa nội dung
   * @returns Promise<void>
   */
  async sendPasswordResetEmail(email: string, resetToken: string, locale: string): Promise<void> {
    this.logger.info('Gửi email đặt lại mật khẩu', {
      email,
      locale,
      tokenLength: resetToken.length
    });

    try {
      // Chuẩn bị URL đặt lại mật khẩu
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

      await this.ndmClient.emit('notification.email.password-reset', {
        recipient: email,
        data: {
          resetToken,
          resetUrl
        },
        locale
      }).toPromise();

      this.logger.info('Email đặt lại mật khẩu đã được gửi thành công', {
        email,
        locale,
        eventType: 'notification.email.password-reset'
      });
    } catch (error) {
      this.logger.error('Lỗi khi gửi email đặt lại mật khẩu', error as Error, {
        email,
        locale,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Gửi email thông báo lời mời tham gia tổ chức.
   * @param email - Email người nhận
   * @param invitationToken - Token lời mời
   * @param organizationName - Tên tổ chức mời
   * @param inviterName - Tên người mời
   * @param locale - Mã locale của người dùng để bản địa hóa nội dung
   * @returns Promise<void>
   */
  async sendOrganizationInvitationEmail(
    email: string,
    invitationToken: string,
    organizationName: string,
    inviterName: string,
    locale: string
  ): Promise<void> {
    this.logger.info('Gửi email lời mời tham gia tổ chức', {
      email,
      organizationName,
      inviterName,
      locale,
      tokenLength: invitationToken.length
    });

    try {
      // Chuẩn bị URL lời mời
      const invitationUrl = `${process.env.CLIENT_URL}/invitations?token=${invitationToken}`;

      await this.ndmClient.emit('notification.email.organization-invitation', {
        recipient: email,
        data: {
          invitationToken,
          organizationName,
          inviterName,
          invitationUrl
        },
        locale
      }).toPromise();

      this.logger.info('Email lời mời tham gia tổ chức đã được gửi thành công', {
        email,
        organizationName,
        inviterName,
        locale,
        eventType: 'notification.email.organization-invitation'
      });
    } catch (error) {
      this.logger.error('Lỗi khi gửi email lời mời tham gia tổ chức', error as Error, {
        email,
        organizationName,
        inviterName,
        locale,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}
