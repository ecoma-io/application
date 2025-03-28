import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { ILogger } from '@ecoma/common-application';

describe('PasswordService', () => {
  let service: PasswordService;
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
        PasswordService,
        {
          provide: 'ILogger',
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('nên được định nghĩa', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('nên mã hóa mật khẩu thành công', async () => {
      const password = 'Password123!';
      const hashedPassword = await service.hashPassword(password);

      // Kiểm tra hash không phải là mật khẩu gốc
      expect(hashedPassword).not.toEqual(password);

      // Kiểm tra định dạng hash bcrypt
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d+\$/);

      // Kiểm tra logger được gọi
      expect(mockLogger.debug).toHaveBeenCalledWith('Mã hóa mật khẩu', expect.any(Object));
      expect(mockLogger.debug).toHaveBeenCalledWith('Mật khẩu đã được mã hóa thành công', expect.any(Object));
    });

    it('nên ghi log lỗi khi mã hóa thất bại', async () => {
      const mockError = new Error('Hash error');
      jest.spyOn(require('bcrypt'), 'hash').mockImplementationOnce(() => {
        throw mockError;
      });

      const password = 'Password123!';

      await expect(service.hashPassword(password)).rejects.toThrow(mockError);
      expect(mockLogger.error).toHaveBeenCalledWith('Lỗi khi mã hóa mật khẩu', mockError, expect.any(Object));
    });
  });

  describe('verifyPassword', () => {
    it('nên xác minh mật khẩu đúng', async () => {
      const password = 'Password123!';
      const hashedPassword = await service.hashPassword(password);

      const isMatch = await service.verifyPassword(password, hashedPassword);

      expect(isMatch).toBe(true);
      expect(mockLogger.debug).toHaveBeenCalledWith('Xác minh mật khẩu', expect.any(Object));
      expect(mockLogger.debug).toHaveBeenCalledWith('Kết quả xác minh mật khẩu', { isMatch: true });
    });

    it('nên trả về false khi mật khẩu không khớp', async () => {
      const password = 'Password123!';
      const wrongPassword = 'WrongPassword123!';
      const hashedPassword = await service.hashPassword(password);

      const isMatch = await service.verifyPassword(wrongPassword, hashedPassword);

      expect(isMatch).toBe(false);
      expect(mockLogger.debug).toHaveBeenCalledWith('Kết quả xác minh mật khẩu', { isMatch: false });
    });

    it('nên ghi log lỗi khi xác minh thất bại', async () => {
      const mockError = new Error('Compare error');
      jest.spyOn(require('bcrypt'), 'compare').mockImplementationOnce(() => {
        throw mockError;
      });

      await expect(service.verifyPassword('password', 'hashedPassword')).rejects.toThrow(mockError);
      expect(mockLogger.error).toHaveBeenCalledWith('Lỗi khi xác minh mật khẩu', mockError, expect.any(Object));
    });
  });
});
