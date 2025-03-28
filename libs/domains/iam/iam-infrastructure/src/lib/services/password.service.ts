import { Injectable, Inject } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { IPasswordService } from '@ecoma/iam-application';
import { ILogger } from '@ecoma/common-application';

/**
 * Triển khai dịch vụ mã hóa và xác minh mật khẩu sử dụng bcrypt.
 */
@Injectable()
export class PasswordService implements IPasswordService {
  /**
   * Số vòng băm, càng cao càng an toàn nhưng càng chậm.
   * Đọc từ biến môi trường BCRYPT_SALT_ROUNDS nếu có, mặc định là 10.
   */
  private readonly saltRounds: number;

  /**
   * Constructor.
   * @param logger - Logger service
   */
  constructor(
    @Inject('ILogger')
    private readonly logger: ILogger
  ) {
    // Đọc số vòng băm từ biến môi trường hoặc sử dụng mặc định
    const envSaltRounds = process.env['BCRYPT_SALT_ROUNDS'];
    this.saltRounds = envSaltRounds ? parseInt(envSaltRounds, 10) : 10;

    this.logger.debug('Khởi tạo PasswordService', {
      saltRounds: this.saltRounds
    });
  }

  /**
   * Mã hóa mật khẩu.
   * @param password - Mật khẩu cần mã hóa
   * @returns Promise chứa chuỗi mật khẩu đã mã hóa
   */
  async hashPassword(password: string): Promise<string> {
    this.logger.debug('Mã hóa mật khẩu', {
      passwordLength: password.length,
      saltRounds: this.saltRounds
    });

    if (!password || password.length === 0) {
      this.logger.error('Không thể mã hóa mật khẩu rỗng');
      throw new Error('Mật khẩu không được để trống');
    }

    try {
      const hashedPassword = await hash(password, this.saltRounds);
      this.logger.debug('Mật khẩu đã được mã hóa thành công', {
        hashedPasswordLength: hashedPassword.length
      });
      return hashedPassword;
    } catch (error) {
      this.logger.error('Lỗi khi mã hóa mật khẩu', error as Error, {
        passwordLength: password.length,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Xác minh mật khẩu có khớp với mật khẩu đã mã hóa không.
   * @param password - Mật khẩu cần xác minh
   * @param hashedPassword - Mật khẩu đã mã hóa
   * @returns Promise<boolean> - true nếu mật khẩu khớp, false nếu không
   */
  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    this.logger.debug('Xác minh mật khẩu', {
      passwordLength: password.length,
      hashedPasswordProvided: !!hashedPassword,
      hashedPasswordLength: hashedPassword ? hashedPassword.length : 0
    });

    if (!password || !hashedPassword) {
      this.logger.warn('Xác minh mật khẩu với dữ liệu không đầy đủ', {
        passwordProvided: !!password,
        hashedPasswordProvided: !!hashedPassword
      });
      return false;
    }

    try {
      const isMatch = await compare(password, hashedPassword);
      this.logger.debug('Kết quả xác minh mật khẩu', { isMatch });
      return isMatch;
    } catch (error) {
      this.logger.error('Lỗi khi xác minh mật khẩu', error as Error, {
        passwordLength: password.length,
        hashedPasswordLength: hashedPassword.length,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}
