import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository, User, UserProfile } from '@ecoma/iam-domain';
import { Email } from '@ecoma/common-domain';
import { LoggerService } from '@ecoma/common-application';
import { RegisterUserHandler } from './register-user.handler';
import { RegisterUserCommand } from './register-user.command';
import { IPasswordService, INotificationService } from '../../../interfaces';
import { EmailAlreadyExistsError } from '../../../errors/user-error';

// Định nghĩa interface phụ cho Result cho mục đích testing
interface IMockResult<T> {
  isSuccess: boolean;
  isFailure: boolean;
  getValue?: () => T;
  error?: string;
}

describe('RegisterUserHandler', () => {
  let handler: RegisterUserHandler;
  let userRepository: jest.Mocked<IUserRepository> & { save: jest.Mock };
  let passwordService: jest.Mocked<IPasswordService>;
  let notificationService: jest.Mocked<INotificationService>;
  let loggerService: jest.Mocked<LoggerService>;

  // Dữ liệu test giả lập
  const mockEmail = 'test@example.com';
  const mockPassword = 'Password123!';
  const mockHashedPassword = 'hashed_password';
  const mockUserId = '12345-67890';
  const mockFirstName = 'Nguyen';
  const mockLastName = 'Van A';
  const mockLocale = 'vi-VN';

  // Mock cho User.register static method
  const mockUserRegisterSuccess: IMockResult<any> = {
    isSuccess: true,
    isFailure: false,
    getValue: jest.fn().mockImplementation(() => ({
      getId: () => mockUserId,
      id: {
        toString: () => mockUserId
      },
      email: {
        value: mockEmail
      },
      profile: {
        firstName: mockFirstName,
        lastName: mockLastName,
        locale: mockLocale
      },
      status: 'PendingConfirmation',
      emailVerificationToken: 'verification-token-123',
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  };

  // Mock cho khi registration thất bại (ví dụ: validation error)
  const mockUserRegisterFailure: IMockResult<any> = {
    isSuccess: false,
    isFailure: true,
    error: 'Validation failed'
  };

  beforeEach(async () => {
    // Tạo mock cho các dependencies
    const userRepositoryMock = {
      findByEmail: jest.fn(),
      save: jest.fn()
    };

    const passwordServiceMock = {
      hashPassword: jest.fn().mockResolvedValue(mockHashedPassword),
      verifyPassword: jest.fn()
    };

    const notificationServiceMock = {
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined)
    };

    const loggerServiceMock = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterUserHandler,
        { provide: 'IUserRepository', useValue: userRepositoryMock },
        { provide: 'IPasswordService', useValue: passwordServiceMock },
        { provide: 'INotificationService', useValue: notificationServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock }
      ]
    }).compile();

    handler = module.get<RegisterUserHandler>(RegisterUserHandler);
    userRepository = module.get('IUserRepository') as any;
    passwordService = module.get('IPasswordService') as jest.Mocked<IPasswordService>;
    notificationService = module.get('INotificationService') as jest.Mocked<INotificationService>;
    loggerService = module.get(LoggerService) as jest.Mocked<LoggerService>;

    // Mocking static method User.register
    jest.spyOn(User, 'register').mockImplementation(() => mockUserRegisterSuccess as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('nên đăng ký người dùng thành công và gửi email xác minh', async () => {
    // Arrange
    const command = new RegisterUserCommand(
      mockEmail,
      mockPassword,
      mockFirstName,
      mockLastName,
      mockLocale,
      true
    );

    userRepository.findByEmail.mockResolvedValue(null);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(passwordService.hashPassword).toHaveBeenCalledWith(mockPassword);
    expect(User.register).toHaveBeenCalledWith(
      expect.any(Email),
      mockHashedPassword,
      expect.any(UserProfile),
      true
    );
    expect(userRepository.save).toHaveBeenCalled();
    expect(notificationService.sendVerificationEmail).toHaveBeenCalledWith(
      mockEmail,
      'verification-token-123',
      mockLocale
    );

    expect(result).toEqual({
      id: mockUserId,
      email: mockEmail,
      firstName: mockFirstName,
      lastName: mockLastName,
      locale: mockLocale,
      status: 'PendingConfirmation',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });

    // Kiểm tra log
    expect(loggerService.info).toHaveBeenCalledWith(
      expect.stringContaining('thành công'),
      expect.objectContaining({
        boundedContext: 'IAM',
        userId: mockUserId,
        email: mockEmail
      })
    );
  });

  it('nên đăng ký người dùng thành công không cần xác minh email', async () => {
    // Arrange
    const command = new RegisterUserCommand(
      mockEmail,
      mockPassword,
      mockFirstName,
      mockLastName,
      mockLocale,
      false
    );

    const activeUser = {
      ...mockUserRegisterSuccess,
      getValue: jest.fn().mockImplementation(() => ({
        getId: () => mockUserId,
        id: {
          toString: () => mockUserId
        },
        email: {
          value: mockEmail
        },
        profile: {
          firstName: mockFirstName,
          lastName: mockLastName,
          locale: mockLocale
        },
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    };

    jest.spyOn(User, 'register').mockImplementation(() => activeUser as any);
    userRepository.findByEmail.mockResolvedValue(null);

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(User.register).toHaveBeenCalledWith(
      expect.any(Email),
      mockHashedPassword,
      expect.any(UserProfile),
      false
    );
    expect(userRepository.save).toHaveBeenCalled();
    expect(notificationService.sendVerificationEmail).not.toHaveBeenCalled();

    expect(result.status).toBe('Active');
  });

  it('nên throw EmailAlreadyExistsError khi email đã tồn tại', async () => {
    // Arrange
    const command = new RegisterUserCommand(
      mockEmail,
      mockPassword,
      mockFirstName,
      mockLastName,
      mockLocale,
      true
    );

    const existingUser = {
      getId: () => 'existing-user-id',
      email: { value: mockEmail }
    };

    userRepository.findByEmail.mockResolvedValue(existingUser as any);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(EmailAlreadyExistsError);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(passwordService.hashPassword).not.toHaveBeenCalled();
    expect(User.register).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();

    // Kiểm tra log
    expect(loggerService.warn).toHaveBeenCalledWith(
      expect.stringContaining('Email đã tồn tại'),
      expect.objectContaining({
        boundedContext: 'IAM',
        email: mockEmail
      })
    );
  });

  it('nên throw error khi User.register thất bại', async () => {
    // Arrange
    const command = new RegisterUserCommand(
      mockEmail,
      mockPassword,
      mockFirstName,
      mockLastName,
      mockLocale,
      true
    );

    userRepository.findByEmail.mockResolvedValue(null);
    jest.spyOn(User, 'register').mockImplementation(() => mockUserRegisterFailure as any);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow('Validation failed');
    expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(passwordService.hashPassword).toHaveBeenCalledWith(mockPassword);
    expect(User.register).toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
    expect(notificationService.sendVerificationEmail).not.toHaveBeenCalled();

    // Kiểm tra log
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining('Lỗi trong quá trình tạo người dùng mới'),
      expect.objectContaining({
        boundedContext: 'IAM',
        error: 'Validation failed',
        email: mockEmail
      })
    );
  });

  it('nên throw error khi lưu user vào repository thất bại', async () => {
    // Arrange
    const command = new RegisterUserCommand(
      mockEmail,
      mockPassword,
      mockFirstName,
      mockLastName,
      mockLocale,
      true
    );

    userRepository.findByEmail.mockResolvedValue(null);
    const saveError = new Error('Database connection error');
    userRepository.save.mockRejectedValue(saveError);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow('Database connection error');
    expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(passwordService.hashPassword).toHaveBeenCalledWith(mockPassword);
    expect(User.register).toHaveBeenCalled();
    expect(userRepository.save).toHaveBeenCalled();
    expect(notificationService.sendVerificationEmail).not.toHaveBeenCalled();

    // Kiểm tra log
    expect(loggerService.error).toHaveBeenCalledWith(
      expect.stringContaining('Lỗi khi lưu người dùng mới'),
      expect.objectContaining({
        boundedContext: 'IAM',
        email: mockEmail,
        error: 'Database connection error'
      })
    );
  });
});
