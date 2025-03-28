import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { ILogger } from '@ecoma/common-application';
import { InvalidTokenError, ITokenPayload } from '@ecoma/iam-application';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;
  let mockLogger: ILogger;

  beforeEach(async () => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
            verify: jest.fn(),
          },
        },
        {
          provide: 'ILogger',
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('nên được định nghĩa', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('nên tạo token thành công', async () => {
      const payload: ITokenPayload = { userId: 'user-123', organizationId: 'org-456' };
      const expiresInSeconds = 3600;

      const result = await service.generateToken(payload, expiresInSeconds);

      expect(result.token).toBe('mock-token');
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(jwtService.sign).toHaveBeenCalledWith(payload, { expiresIn: expiresInSeconds });
      expect(mockLogger.debug).toHaveBeenCalledWith('Tạo token xác thực mới', expect.any(Object));
      expect(mockLogger.debug).toHaveBeenCalledWith('Token xác thực đã được tạo thành công', expect.any(Object));
    });

    it('nên sử dụng thời gian hết hạn mặc định nếu không được cung cấp', async () => {
      const payload: ITokenPayload = { userId: 'user-123', organizationId: 'org-456' };

      await service.generateToken(payload);

      expect(jwtService.sign).toHaveBeenCalledWith(payload, { expiresIn: 3600 });
    });

    it('nên ghi log lỗi khi tạo token thất bại', async () => {
      const mockError = new Error('JWT sign error');
      jest.spyOn(jwtService, 'sign').mockImplementationOnce(() => {
        throw mockError;
      });

      const payload: ITokenPayload = { userId: 'user-123', organizationId: 'org-456' };

      await expect(service.generateToken(payload)).rejects.toThrow(mockError);
      expect(mockLogger.error).toHaveBeenCalledWith('Lỗi khi tạo token xác thực', mockError, expect.any(Object));
    });
  });

  describe('verifyToken', () => {
    it('nên xác minh token hợp lệ', async () => {
      const payload: ITokenPayload = { userId: 'user-123', organizationId: 'org-456' };
      jest.spyOn(jwtService, 'verify').mockReturnValueOnce(payload);

      const result = await service.verifyToken('valid-token');

      expect(result).toEqual(payload);
      expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
      expect(mockLogger.debug).toHaveBeenCalledWith('Xác minh token', expect.any(Object));
      expect(mockLogger.debug).toHaveBeenCalledWith('Token hợp lệ', expect.any(Object));
    });

    it('nên ném InvalidTokenError khi token không hợp lệ', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(InvalidTokenError);
      expect(mockLogger.warn).toHaveBeenCalledWith('Token không hợp lệ hoặc đã hết hạn', expect.any(Object));
    });
  });
});
