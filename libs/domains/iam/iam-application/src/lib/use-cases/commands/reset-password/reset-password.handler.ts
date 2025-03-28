import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from '@ecoma/iam-domain';
import { ResetPasswordCommand } from './reset-password.command';
import { IPasswordService } from '../../../interfaces';
import { InvalidResetTokenError, PasswordResetFailedError } from '../../../errors';

/**
 * Handler xử lý command đặt lại mật khẩu.
 */
@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand, void> {
  /**
   * Constructor.
   * @param userRepository - Repository làm việc với User
   * @param passwordService - Service xử lý mật khẩu
   */
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('IPasswordService')
    private readonly passwordService: IPasswordService
  ) {}

  /**
   * Xử lý command đặt lại mật khẩu.
   * @param command - Command đặt lại mật khẩu
   */
  async execute(command: ResetPasswordCommand): Promise<void> {
    // Tìm user có token đặt lại mật khẩu tương ứng
    const user = await this.userRepository.findByPasswordResetToken(command.token);

    if (!user) {
      throw new InvalidResetTokenError();
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await this.passwordService.hashPassword(command.newPassword);

    // Đặt lại mật khẩu
    const result = user.resetPassword(command.token, hashedPassword);

    if (result.isFailure) {
      throw new PasswordResetFailedError("Password reset failed");
    }

    // Lưu user đã cập nhật
    await this.userRepository.save(user);
  }
}
