import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService, ITokenPayload, ITokenResult, InvalidTokenError } from '@ecoma/iam-application';
import { ILogger } from '@ecoma/common-application';

/**
 * Triển khai dịch vụ quản lý token sử dụng JWT.
 */
@Injectable()
export class TokenService implements ITokenService {
  /**
   * Constructor.
   * @param jwtService - Dịch vụ JWT
   * @param logger - Logger service
   */
  constructor(
    private readonly jwtService: JwtService,
    @Inject('ILogger')
    private readonly logger: ILogger
  ) {}

  /**
   * Tạo token xác thực mới.
   * @param payload - Payload cho token
   * @param expiresInSeconds - Thời hạn của token (giây)
   * @returns ITokenResult chứa token và thời gian hết hạn
   */
  async generateToken(
    payload: ITokenPayload,
    expiresInSeconds = 3600
  ): Promise<ITokenResult> {
    this.logger.debug('Tạo token xác thực mới', {
      userId: payload.userId,
      organizationId: payload.organizationId,
      expiresInSeconds
    });

    try {
      // Tính thời gian hết hạn
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);

      // Tạo token
      const token = this.jwtService.sign(payload, {
        expiresIn: expiresInSeconds
      });

      this.logger.debug('Token xác thực đã được tạo thành công', {
        userId: payload.userId,
        expiresAt: expiresAt.toISOString()
      });

      return {
        token,
        expiresAt
      };
    } catch (error) {
      this.logger.error('Lỗi khi tạo token xác thực', error as Error, {
        userId: payload.userId,
        organizationId: payload.organizationId,
        expiresInSeconds
      });
      throw error;
    }
  }

  /**
   * Xác minh và giải mã token.
   * @param token - Token cần xác minh
   * @returns Promise<ITokenPayload> - Payload từ token nếu hợp lệ
   * @throws InvalidTokenError nếu token không hợp lệ hoặc đã hết hạn
   */
  async verifyToken(token: string): Promise<ITokenPayload> {
    this.logger.debug('Xác minh token', {
      tokenProvided: !!token,
      tokenLength: token ? token.length : 0
    });

    try {
      const payload = this.jwtService.verify<ITokenPayload>(token);

      if (!payload || !payload.userId) {
        this.logger.warn('Token hợp lệ nhưng không chứa payload đúng định dạng', {
          payloadReceived: payload ? JSON.stringify(payload) : 'null'
        });
        throw new InvalidTokenError('Token payload không hợp lệ');
      }

      this.logger.debug('Token hợp lệ', {
        userId: payload.userId,
        organizationId: payload.organizationId
      });
      return payload;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw error;
      }

      this.logger.warn('Token không hợp lệ hoặc đã hết hạn', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new InvalidTokenError('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
