import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  User,
  IUserRepository,
  UserProfile
} from '@ecoma/iam-domain';
import { Email } from '@ecoma/common-domain';
import { LoggerService } from '@ecoma/common-application';
import { RegisterUserCommand } from './register-user.command';
import { IUserDto } from '../../../dtos';
import { IPasswordService, INotificationService } from '../../../interfaces';
import { EmailAlreadyExistsError } from '../../../errors/user-error';

/**
 * Handler xử lý command đăng ký người dùng.
 */
@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand, IUserDto> {
  /**
   * Constructor.
   * @param userRepository - Repository làm việc với User
   * @param passwordService - Service xử lý mật khẩu
   * @param notificationService - Service gửi thông báo
   * @param logger - Service ghi log
   */
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('IPasswordService')
    private readonly passwordService: IPasswordService,

    @Inject('INotificationService')
    private readonly notificationService: INotificationService,

    private readonly logger: LoggerService
  ) {}

  /**
   * Xử lý command đăng ký người dùng.
   * @param command - Command đăng ký người dùng
   * @returns IUserDto - Thông tin người dùng đã đăng ký
   */
  async execute(command: RegisterUserCommand): Promise<IUserDto> {
    this.logger.info('Đang xử lý đăng ký người dùng mới', {
      boundedContext: 'IAM',
      email: command.email,
      requireEmailVerification: command.requireEmailVerification
    });

    // Chuyển đổi email thành value object
    const emailAddress = new Email(command.email);

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.userRepository.findByEmail(emailAddress);
    if (existingUser) {
      this.logger.warn('Đăng ký thất bại: Email đã tồn tại', {
        boundedContext: 'IAM',
        email: command.email
      });
      throw new EmailAlreadyExistsError(command.email);
    }

    // Tạo profile cho người dùng
    this.logger.debug('Tạo profile cho người dùng mới', {
      boundedContext: 'IAM',
      firstName: command.firstName,
      lastName: command.lastName,
      locale: command.locale
    });
    const profile = new UserProfile(command.firstName, command.lastName, command.locale);

    // Hash mật khẩu
    this.logger.debug('Đang hash mật khẩu người dùng', {
      boundedContext: 'IAM'
    });
    const hashedPassword = await this.passwordService.hashPassword(command.password);

    // Tạo người dùng mới
    const userResult = User.register(emailAddress, hashedPassword, profile, command.requireEmailVerification);

    if (userResult.isFailure) {
      const errorMessage = 'Validation failed';
      this.logger.error('Lỗi trong quá trình tạo người dùng mới', {
        boundedContext: 'IAM',
        email: command.email,
        error: errorMessage
      });
      throw new Error(errorMessage);
    }

    const user = userResult.getValue();
    const userId = user.getId();

    // Lưu người dùng vào repository
    this.logger.debug('Lưu người dùng mới vào database', {
      boundedContext: 'IAM',
      email: command.email
    });

    // IUserRepository kế thừa từ IRepository có phương thức save
    try {
      await this.userRepository.save(user);
    } catch (error) {
      this.logger.error('Lỗi khi lưu người dùng mới vào database', {
        boundedContext: 'IAM',
        email: command.email,
        error: (error as Error).message
      });
      throw error;
    }

    // Gửi email xác minh nếu cần
    if (command.requireEmailVerification && user.emailVerificationToken) {
      this.logger.info('Gửi email xác minh cho người dùng mới', {
        boundedContext: 'IAM',
        email: user.email.value,
        userId,
        locale: user.profile.locale
      });

      await this.notificationService.sendVerificationEmail(
        user.email.value,
        user.emailVerificationToken,
        user.profile.locale
      );
    }

    this.logger.info('Đăng ký người dùng mới thành công', {
      boundedContext: 'IAM',
      userId,
      email: user.email.value,
      requireEmailVerification: command.requireEmailVerification
    });

    // Trả về thông tin người dùng
    return {
      id: userId,
      email: user.email.value,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      locale: user.profile.locale,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
