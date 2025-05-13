import { IGenericResult, Result } from '@ecoma/common-application';
import { RegisterUserHandler } from './register-user.handler';
import { RegisterUserCommand } from './register-user.command';
import {
  EmailAddress,
  IUserRepository,
  ITokenService,
  Password,
  PasswordHash,
  User,
  UserProfile,
} from '@ecoma/iam-domain';
import { IPasswordHasher } from '../../ports/password-hasher.port';
import { IEventPublisher } from '../../ports/event-publisher.port';
import { INdmServiceGateway } from '../../ports/ndm-gateway.port';
import { RegisterUserEmailExistsErrorDetail, RegisterUserPasswordPolicyErrorDetail } from './register-user.error-details';

describe('RegisterUserHandler', () => {
  let handler: RegisterUserHandler;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockTokenService: jest.Mocked<ITokenService>;
  let mockPasswordHasher: jest.Mocked<IPasswordHasher>;
  let mockEventBus: jest.Mocked<IEventPublisher>;
  let mockNdmGateway: jest.Mocked<INdmServiceGateway>;

  const validCommand = new RegisterUserCommand(
    'test@example.com',
    'StrongPassword123!',
    'John',
    'Doe',
    'en-US'
  );

  beforeEach(() => {
    // Tạo mock cho tất cả các dependency
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    mockTokenService = {
      generateEmailVerificationToken: jest.fn(),
    } as unknown as jest.Mocked<ITokenService>;

    mockPasswordHasher = {
      hash: jest.fn(),
    } as unknown as jest.Mocked<IPasswordHasher>;

    mockEventBus = {
      publish: jest.fn(),
    } as unknown as jest.Mocked<IEventPublisher>;

    mockNdmGateway = {
      sendVerificationEmail: jest.fn(),
    } as unknown as jest.Mocked<INdmServiceGateway>;

    // Cấu hình các mock mặc định
    mockUserRepository.findByEmail.mockResolvedValue(null); // Không tìm thấy user (happy path)
    mockPasswordHasher.hash.mockResolvedValue('hashed_password');
    mockTokenService.generateEmailVerificationToken.mockReturnValue({
      token: 'verification_token',
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000), // 24 giờ từ bây giờ
    });

    // Mock các statiz method
    jest.spyOn(Password, 'create').mockImplementation(password => password as unknown as Password);
    jest.spyOn(EmailAddress, 'create').mockImplementation(email => ({ value: email }) as unknown as EmailAddress);
    jest.spyOn(PasswordHash, 'create').mockImplementation(hash => ({ value: hash }) as unknown as PasswordHash);
    jest.spyOn(UserProfile, 'create').mockImplementation(profile => profile as unknown as UserProfile);
    jest.spyOn(User, 'create').mockImplementation(props => ({
      id: 'mock-user-id',
      email: props.email,
      profile: props.profile,
      passwordHash: props.passwordHash,
      initiateEmailVerification: jest.fn(),
      createdAt: new Date(),
    }) as unknown as User);

    // Khởi tạo handler với các mock dependency
    handler = new RegisterUserHandler(
      mockUserRepository,
      mockTokenService,
      mockPasswordHasher,
      mockEventBus,
      mockNdmGateway
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('nên đăng ký người dùng thành công khi tất cả thông tin hợp lệ', async () => {
      // Arrange
      const mockUser = {
        id: 'mock-user-id',
        initiateEmailVerification: jest.fn(),
        email: { value: validCommand.email },
        profile: {
          firstName: validCommand.firstName,
          lastName: validCommand.lastName,
          locale: validCommand.locale,
        },
      } as unknown as User;

      jest.spyOn(User, 'create').mockReturnValue(mockUser);

      // Act
      const result = await handler.execute(validCommand);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(mockUserRepository.findByEmail).toHaveBeenCalled();
      expect(mockPasswordHasher.hash).toHaveBeenCalledWith(validCommand.password);
      expect(User.create).toHaveBeenCalled();
      expect(mockTokenService.generateEmailVerificationToken).toHaveBeenCalledWith(mockUser.id);
      expect(mockUser.initiateEmailVerification).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockEventBus.publish).toHaveBeenCalled();
      expect(mockNdmGateway.sendVerificationEmail).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email.value,
        mockUser.profile.firstName,
        'verification_token',
        mockUser.profile.locale
      );
    });

    it('nên trả về lỗi khi email đã tồn tại', async () => {
      // Arrange
      const existingUser = { id: 'existing-user-id' } as User;
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act
      const result = await handler.execute(validCommand);

      // Assert
      expect(result.isFailure).toBe(true);
      expect(result.error).toBeInstanceOf(RegisterUserEmailExistsErrorDetail);
      expect(mockUserRepository.findByEmail).toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
      expect(mockNdmGateway.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it('nên trả về lỗi khi mật khẩu không đáp ứng yêu cầu chính sách', async () => {
      // Arrange
      const weakPasswordCommand = new RegisterUserCommand(
        'test@example.com',
        'weak',
        'John',
        'Doe',
        'en-US'
      );

      // Mock Password.create để ném lỗi
      jest.spyOn(Password, 'create').mockImplementation(() => {
        throw new Error('Password policy violated');
      });

      // Act
      const result = await handler.execute(weakPasswordCommand);

      // Assert
      expect(result.isFailure).toBe(true);
      expect(result.error).toBeInstanceOf(RegisterUserPasswordPolicyErrorDetail);
      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
      expect(mockEventBus.publish).not.toHaveBeenCalled();
      expect(mockNdmGateway.sendVerificationEmail).not.toHaveBeenCalled();
    });

    it('nên ném lỗi khi xảy ra lỗi hệ thống không mong muốn', async () => {
      // Arrange
      mockUserRepository.save.mockRejectedValue(new Error('Database connection error'));

      // Act & Assert
      await expect(handler.execute(validCommand)).rejects.toThrow('Database connection error');
      expect(mockUserRepository.findByEmail).toHaveBeenCalled();
      expect(mockPasswordHasher.hash).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });
});
