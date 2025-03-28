import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from '@ecoma/iam-domain';
import { VerifyEmailCommand } from './verify-email.command';
import { InvalidVerificationTokenError, VerificationFailedError } from '../../../errors';

/**
 * Handler xử lý command xác minh email.
 */
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand, void> {
  /**
   * Constructor.
   * @param userRepository - Repository làm việc với User
   */
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Xử lý command xác minh email.
   * @param command - Command xác minh email
   */
  async execute(command: VerifyEmailCommand): Promise<void> {
    // Tìm user có token xác minh email tương ứng
    const user = await this.userRepository.findByEmailVerificationToken(command.token);

    if (!user) {
      throw new InvalidVerificationTokenError();
    }

    // Xác minh email
    const result = user.verifyEmail(command.token);

    if (result.isFailure) {
      throw new VerificationFailedError("Email verification failed");
    }

    // Lưu user đã cập nhật
    await this.userRepository.save(user);
  }
}
