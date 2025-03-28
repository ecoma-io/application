import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from '@ecoma/iam-domain';
import { Email } from '@ecoma/common-domain';
import { LoggerService } from '@ecoma/common-application';
import { LoginUserHandler } from './login-user.handler';
import { LoginUserCommand } from './login-user.command';
import { IPasswordService, ISessionService, IBumClient } from '../../../interfaces';
import { InvalidCredentialsError, AccountDisabledError } from '../../../errors/authentication-error';
import { OrganizationError } from '../../../errors/organization-error';

describe('LoginUserHandler', () => {
  let handler: LoginUserHandler;
  let userRepository: jest.Mocked<IUserRepository>;
  let passwordService: jest.Mocked<IPasswordService>;
  let sessionService: jest.Mocked<ISessionService>;
  let bumClient: jest.Mocked<IBumClient>;
  let loggerService: jest.Mocked<LoggerService>;

  // Dữ liệu test giả lập
  const mockEmail = 'test@example.com';
  const mockPassword = 'Password123!';
  const mockUserId = '12345-67890';
  const mockSessionToken = 'session-token-123';
  const mockOrganizationId = 'org-12345';

  // User giả lập với id là một đối tượng có hàm toString() và bổ sung hàm getId()
  const mockUser = {
    // Mô phỏng cấu trúc id trong AggregateRoot và AbstractId
    id: {
      toString: () => mockUserId,
      value: mockUserId,
      equals: () => true
    },
    // Thêm phương thức getId() cho phù hợp với phiên bản mới của User aggregate
    getId: () => mockUserId,
    email: { value: mockEmail },
    status: 'Active',
    passwordHash: 'hashed_password',
    profile: {
      firstName: 'Nguyen',
      lastName: 'Van A',
      locale: 'vi-VN'
    }
  };

  // SessionInfo giả lập đầy đủ theo interface ISessionInfo
  const mockSessionInfo = {
    id: 'session-123',
    userId: mockUserId,
    token: mockSessionToken,
    expiresAt: new Date(Date.now() + 3600000), // 1 giờ sau
    createdAt: new Date(),
    organizationId: undefined
  };

  beforeEach(async () => {
    // Tạo mock cho các dependencies
    const userRepositoryMock = {
      findByEmail: jest.fn()
    };

    const passwordServiceMock = {
      verifyPassword: jest.fn()
    };

    const sessionServiceMock = {
      createSession: jest.fn()
    };

    const bumClientMock = {
      isOrganizationActive: jest.fn()
    };

    const loggerServiceMock = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUserHandler,
        { provide: 'IUserRepository', useValue: userRepositoryMock },
        { provide: 'IPasswordService', useValue: passwordServiceMock },
        { provide: 'ISessionService', useValue: sessionServiceMock },
        { provide: 'IBumClient', useValue: bumClientMock },
        { provide: LoggerService, useValue: loggerServiceMock }
      ]
    }).compile();

    handler = module.get<LoginUserHandler>(LoginUserHandler);
    userRepository = module.get('IUserRepository') as jest.Mocked<IUserRepository>;
    passwordService = module.get('IPasswordService') as jest.Mocked<IPasswordService>;
    sessionService = module.get('ISessionService') as jest.Mocked<ISessionService>;
    bumClient = module.get('IBumClient') as jest.Mocked<IBumClient>;
    loggerService = module.get(LoggerService) as jest.Mocked<LoggerService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('nên đăng nhập thành công khi thông tin đăng nhập hợp lệ', async () => {
    // Arrange
    const command = new LoginUserCommand(mockEmail, mockPassword);
    
    userRepository.findByEmail.mockResolvedValue(mockUser as any);
    passwordService.verifyPassword.mockResolvedValue(true);
    sessionService.createSession.mockResolvedValue(mockSessionInfo);
    
    // Act
    const result = await handler.execute(command);
    
    // Assert
    expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(passwordService.verifyPassword).toHaveBeenCalledWith(mockPassword, mockUser.passwordHash);
    expect(sessionService.createSession).toHaveBeenCalledWith(mockUserId, undefined);
    
    expect(result).toEqual({
      id: mockUserId,
      email: mockEmail,
      firstName: mockUser.profile.firstName,
      lastName: mockUser.profile.lastName,
      locale: mockUser.profile.locale,
      sessionToken: mockSessionToken,
      expiresAt: mockSessionInfo.expiresAt,
      currentOrganizationId: undefined
    });
    
    // Kiểm tra log
    expect(loggerService.info).toHaveBeenCalledWith(
      expect.stringContaining('thành công'),
      expect.objectContaining({
        boundedContext: 'IAM',
        userId: mockUserId,
        email: mockEmail,
        result: 'success'
      })
    );
  });

  it('nên đăng nhập thành công với ngữ cảnh tổ chức khi tổ chức active', async () => {
    // Arrange
    const command = new LoginUserCommand(mockEmail, mockPassword, mockOrganizationId);
    
    const mockSessionInfoWithOrg = {
      ...mockSessionInfo,
      organizationId: mockOrganizationId
    };
    
    userRepository.findByEmail.mockResolvedValue(mockUser as any);
    passwordService.verifyPassword.mockResolvedValue(true);
    bumClient.isOrganizationActive.mockResolvedValue(true);
    sessionService.createSession.mockResolvedValue(mockSessionInfoWithOrg);
    
    // Act
    const result = await handler.execute(command);
    
    // Assert
    expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(passwordService.verifyPassword).toHaveBeenCalledWith(mockPassword, mockUser.passwordHash);
    expect(bumClient.isOrganizationActive).toHaveBeenCalledWith(mockOrganizationId);
    expect(sessionService.createSession).toHaveBeenCalledWith(mockUserId, mockOrganizationId);
    
    expect(result).toEqual({
      id: mockUserId,
      email: mockEmail,
      firstName: mockUser.profile.firstName,
      lastName: mockUser.profile.lastName,
      locale: mockUser.profile.locale,
      sessionToken: mockSessionToken,
      expiresAt: mockSessionInfo.expiresAt,
      currentOrganizationId: mockOrganizationId
    });
  });

  it('nên throw InvalidCredentialsError khi email không tồn tại', async () => {
    // Arrange
    const command = new LoginUserCommand(mockEmail, mockPassword);
    
    userRepository.findByEmail.mockResolvedValue(null);
    
    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(InvalidCredentialsError);
    
    expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(passwordService.verifyPassword).not.toHaveBeenCalled();
    expect(sessionService.createSession).not.toHaveBeenCalled();
    
    // Kiểm tra log
    expect(loggerService.warn).toHaveBeenCalledWith(
      expect.stringContaining('Email không tồn tại'),
      expect.objectContaining({
        boundedContext: 'IAM',
        email: mockEmail,
        failureReason: 'user_not_found'
      })
    );
  });

  it('nên throw AccountDisabledError khi tài khoản không active', async () => {
    // Arrange
    const command = new LoginUserCommand(mockEmail, mockPassword);
    const inactiveUser = {
      ...mockUser,
      status: 'Inactive'
    };
    
    userRepository.findByEmail.mockResolvedValue(inactiveUser as any);
    
    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(AccountDisabledError);
    
    expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(passwordService.verifyPassword).not.toHaveBeenCalled();
    expect(sessionService.createSession).not.toHaveBeenCalled();
    
    // Kiểm tra log
    expect(loggerService.warn).toHaveBeenCalledWith(
      expect.stringContaining('Tài khoản không active'),
      expect.objectContaining({
        boundedContext: 'IAM',
        email: mockEmail,
        userId: mockUserId,
        currentStatus: 'Inactive',
        failureReason: 'account_not_active'
      })
    );
  });

  it('nên throw InvalidCredentialsError khi mật khẩu không đúng', async () => {
    // Arrange
    const command = new LoginUserCommand(mockEmail, 'wrong_password');
    
    userRepository.findByEmail.mockResolvedValue(mockUser as any);
    passwordService.verifyPassword.mockResolvedValue(false);
    
    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(InvalidCredentialsError);
    
    expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(passwordService.verifyPassword).toHaveBeenCalledWith('wrong_password', mockUser.passwordHash);
    expect(sessionService.createSession).not.toHaveBeenCalled();
    
    // Kiểm tra log
    expect(loggerService.warn).toHaveBeenCalledWith(
      expect.stringContaining('Mật khẩu không chính xác'),
      expect.objectContaining({
        boundedContext: 'IAM',
        email: mockEmail,
        userId: mockUserId,
        failureReason: 'invalid_password'
      })
    );
  });

  it('nên throw OrganizationError khi đăng nhập vào tổ chức không active', async () => {
    // Arrange
    const command = new LoginUserCommand(mockEmail, mockPassword, mockOrganizationId);
    
    userRepository.findByEmail.mockResolvedValue(mockUser as any);
    passwordService.verifyPassword.mockResolvedValue(true);
    bumClient.isOrganizationActive.mockResolvedValue(false);
    
    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(OrganizationError);
    
    expect(userRepository.findByEmail).toHaveBeenCalledWith(expect.any(Email));
    expect(passwordService.verifyPassword).toHaveBeenCalledWith(mockPassword, mockUser.passwordHash);
    expect(bumClient.isOrganizationActive).toHaveBeenCalledWith(mockOrganizationId);
    expect(sessionService.createSession).not.toHaveBeenCalled();
    
    // Kiểm tra log
    expect(loggerService.warn).toHaveBeenCalledWith(
      expect.stringContaining('Tổ chức không active'),
      expect.objectContaining({
        boundedContext: 'IAM',
        organizationId: mockOrganizationId,
        userId: mockUserId,
        failureReason: 'organization_not_active'
      })
    );
  });
}); 