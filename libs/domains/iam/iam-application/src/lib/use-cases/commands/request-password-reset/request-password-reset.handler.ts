import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from '@ecoma/iam-domain';
import { Email } from '@ecoma/common-domain';
import { RequestPasswordResetCommand } from './request-password-reset.command';
import { INotificationService } from '../../../interfaces';
import { UserNotFoundError, UserNotActiveError } from '../../../errors';

/**
 * Handler xử lý command yêu cầu đặt lại mật khẩu.
 */
@CommandHandler(RequestPasswordResetCommand)
export class RequestPasswordResetHandler implements ICommandHandler<RequestPasswordResetCommand, void> {
  /**
   * Constructor.
   * @param userRepository - Repository làm việc với User
   * @param notificationService - Service gửi thông báo
   */
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('INotificationService')
    private readonly notificationService: INotificationService
  ) {}

  /**
   * Xử lý command yêu cầu đặt lại mật khẩu.
   * @param command - Command yêu cầu đặt lại mật khẩu
   */
  async execute(command: RequestPasswordResetCommand): Promise<void> {
    // Tìm user theo email
    const emailObj = new Email(command.email);
    const user = await this.userRepository.findByEmail(emailObj);
    if (!user) {
      throw new UserNotFoundError();
    }

    // Kiểm tra trạng thái người dùng
    if (user.status !== 'Active') {
      throw new UserNotActiveError("user-id");
    }

    // Tạo token đặt lại mật khẩu
    const resetTokenResult = user.requestPasswordReset();

    if (resetTokenResult.isFailure) {
      throw new Error("Failed to generate password reset token");
    }

    const resetToken = resetTokenResult.getValue();

    // Lưu user đã cập nhật
    await this.userRepository.save(user);

    // Gửi email đặt lại mật khẩu
    await this.notificationService.sendPasswordResetEmail(
      user.email.value,
      resetToken,
      user.profile.locale
    );
  }
}
