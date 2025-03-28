import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from '@ecoma/iam-domain';
import { Email } from '@ecoma/common-domain';
import { LoggerService } from '@ecoma/common-application';
import { LoginUserCommand } from './login-user.command';
import { LoginResultDto } from '../../../dtos';
import { IPasswordService, ISessionService, IBumClient } from '../../../interfaces';
import { InvalidCredentialsError, AccountDisabledError } from '../../../errors/authentication-error';
import { OrganizationError } from '../../../errors/organization-error';

/**
 * Handler xử lý command đăng nhập.
 * Sử dụng Session Token Stateful để hỗ trợ các tính năng quan trọng như:
 * - Vô hiệu hóa phiên từ xa tức thời
 * - Cập nhật quyền theo thời gian thực
 * - Đồng bộ trạng thái tổ chức
 * - Quản lý đa phiên
 */
@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand, LoginResultDto> {
  /**
   * Constructor.
   * @param userRepository - Repository làm việc với User
   * @param passwordService - Service xử lý mật khẩu
   * @param sessionService - Service quản lý phiên làm việc
   * @param bumClient - Client giao tiếp với BUM BC
   * @param logger - Service ghi log
   */
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('IPasswordService')
    private readonly passwordService: IPasswordService,

    @Inject('ISessionService')
    private readonly sessionService: ISessionService,

    @Inject('IBumClient')
    private readonly bumClient: IBumClient,

    private readonly logger: LoggerService
  ) {}

  /**
   * Xử lý command đăng nhập.
   * @param command - Command đăng nhập
   * @returns LoginResultDto - Kết quả đăng nhập với Session Token Stateful
   */
  async execute(command: LoginUserCommand): Promise<LoginResultDto> {
    this.logger.info('Đang xử lý đăng nhập người dùng', {
      boundedContext: 'IAM',
      email: command.email,
      hasOrganizationContext: !!command.organizationId,
      actionType: 'login_attempt',
      sessionType: 'stateful'
    });

    // Chuyển đổi email thành value object
    const emailAddress = new Email(command.email);

    // Tìm user theo email
    this.logger.debug('Tìm kiếm user theo email', {
      boundedContext: 'IAM',
      email: command.email
    });

    const user = await this.userRepository.findByEmail(emailAddress);
    if (!user) {
      this.logger.warn('Đăng nhập thất bại: Email không tồn tại', {
        boundedContext: 'IAM',
        email: command.email,
        failureReason: 'user_not_found'
      });
      throw new InvalidCredentialsError();
    }

    // Sử dụng phương thức getId() mới để lấy ID từ User aggregate
    const userId = user.getId();

    // Kiểm tra trạng thái người dùng
    this.logger.debug('Kiểm tra trạng thái người dùng', {
      boundedContext: 'IAM',
      userId,
      currentStatus: user.status
    });

    if (user.status !== 'Active') {
      this.logger.warn('Đăng nhập thất bại: Tài khoản không active', {
        boundedContext: 'IAM',
        email: command.email,
        userId,
        currentStatus: user.status,
        failureReason: 'account_not_active'
      });
      throw new AccountDisabledError();
    }

    // Xác minh mật khẩu
    this.logger.debug('Đang xác minh mật khẩu', {
      boundedContext: 'IAM',
      userId
    });

    const isPasswordValid = await this.passwordService.verifyPassword(
      command.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      this.logger.warn('Đăng nhập thất bại: Mật khẩu không chính xác', {
        boundedContext: 'IAM',
        email: command.email,
        userId,
        failureReason: 'invalid_password'
      });
      throw new InvalidCredentialsError();
    }

    // Kiểm tra trạng thái tổ chức nếu đăng nhập vào phạm vi tổ chức
    if (command.organizationId) {
      this.logger.debug('Kiểm tra trạng thái tổ chức', {
        boundedContext: 'IAM',
        organizationId: command.organizationId,
        userId
      });

      const isOrgActive = await this.bumClient.isOrganizationActive(command.organizationId);
      if (!isOrgActive) {
        this.logger.warn('Đăng nhập thất bại: Tổ chức không active', {
          boundedContext: 'IAM',
          organizationId: command.organizationId,
          userId,
          failureReason: 'organization_not_active'
        });
        throw new OrganizationError('Tổ chức không active hoặc đã bị đình chỉ');
      }
    }

    // Tạo phiên làm việc stateful
    this.logger.debug('Tạo phiên làm việc stateful mới', {
      boundedContext: 'IAM',
      userId,
      organizationId: command.organizationId,
      sessionType: 'stateful'
    });

    const sessionInfo = await this.sessionService.createSession(
      userId,
      command.organizationId
    );

    this.logger.info('Đăng nhập thành công', {
      boundedContext: 'IAM',
      userId,
      email: user.email.value,
      organizationId: command.organizationId,
      sessionId: sessionInfo.id,
      sessionType: 'stateful',
      result: 'success'
    });

    // Trả về kết quả đăng nhập
    return {
      id: userId,
      email: user.email.value,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      locale: user.profile.locale,
      sessionToken: sessionInfo.token,
      expiresAt: sessionInfo.expiresAt,
      lastActiveAt: sessionInfo.lastActiveAt,
      currentOrganizationId: command.organizationId
    };
  }
}
