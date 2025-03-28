import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ISessionService, SessionInfo, SessionExpiredError } from '@ecoma/iam-application';
import { ILogger } from '@ecoma/common-application';
import { SessionEntity } from '../persistence/typeorm/entities/session.entity';

/**
 * Triển khai dịch vụ quản lý phiên làm việc sử dụng TypeORM.
 * Sử dụng Session Token Stateful để hỗ trợ các tính năng:
 * - Vô hiệu hóa phiên từ xa tức thời
 * - Cập nhật quyền theo thời gian thực
 * - Đồng bộ trạng thái tổ chức
 * - Quản lý đa phiên
 */
@Injectable()
export class SessionService implements ISessionService {
  /**
   * Constructor.
   * @param sessionRepository - TypeORM repository cho Session
   * @param logger - Logger service
   */
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    @Inject('ILogger')
    private readonly logger: ILogger
  ) {}

  /**
   * Tạo phiên làm việc mới.
   * @param userId - ID của người dùng
   * @param organizationId - ID của tổ chức (nếu phiên làm việc trong phạm vi tổ chức)
   * @returns Promise<SessionInfo> - Thông tin phiên làm việc mới
   */
  async createSession(userId: string, organizationId?: string): Promise<SessionInfo> {
    this.logger.debug('Tạo phiên làm việc mới', {
      userId,
      organizationId,
      tokenType: 'stateful'
    });

    try {
      // Tạo session entity mới
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setHours(expiresAt.getHours() + 24); // Phiên làm việc có hiệu lực 24 giờ

      const sessionEntity = new SessionEntity();
      sessionEntity.id = uuidv4();
      sessionEntity.userId = userId;
      sessionEntity.organizationId = organizationId;
      sessionEntity.token = uuidv4(); // Tạo token ngẫu nhiên
      sessionEntity.expiresAt = expiresAt;
      sessionEntity.lastActiveAt = now;

      // Lưu vào cơ sở dữ liệu
      const savedSession = await this.sessionRepository.save(sessionEntity);

      this.logger.debug('Phiên làm việc đã được tạo thành công', {
        sessionId: savedSession.id,
        userId,
        expiresAt: savedSession.expiresAt.toISOString()
      });

      // Chuyển đổi từ entity sang DTO
      return this.toSessionInfo(savedSession);
    } catch (error) {
      this.logger.error('Lỗi khi tạo phiên làm việc', error as Error, {
        userId,
        organizationId
      });
      throw error;
    }
  }

  /**
   * Xác minh phiên làm việc và cập nhật thời điểm hoạt động cuối cùng.
   * @param token - Token phiên làm việc
   * @returns Promise<SessionInfo> - Thông tin phiên làm việc nếu hợp lệ
   * @throws SessionExpiredError nếu phiên làm việc không hợp lệ hoặc đã hết hạn
   */
  async validateSession(token: string): Promise<SessionInfo> {
    this.logger.debug('Xác minh phiên làm việc', {
      tokenProvided: !!token,
      tokenLength: token ? token.length : 0,
      tokenType: 'stateful'
    });

    try {
      const session = await this.sessionRepository.findOne({ where: { token } });

      if (!session) {
        this.logger.warn('Phiên làm việc không tồn tại', {
          tokenProvided: !!token,
          tokenLength: token ? token.length : 0
        });
        throw new SessionExpiredError('Phiên làm việc không tồn tại');
      }

      // Kiểm tra phiên làm việc đã hết hạn chưa
      const now = new Date();
      if (session.expiresAt < now) {
        // Xóa phiên làm việc đã hết hạn
        await this.sessionRepository.remove(session);
        this.logger.warn('Phiên làm việc đã hết hạn và bị xóa', {
          sessionId: session.id,
          userId: session.userId,
          expiresAt: session.expiresAt.toISOString(),
          currentTime: now.toISOString()
        });
        throw new SessionExpiredError('Phiên làm việc đã hết hạn');
      }

      // Cập nhật thời điểm hoạt động cuối cùng
      session.lastActiveAt = now;
      await this.sessionRepository.save(session);

      this.logger.debug('Phiên làm việc hợp lệ', {
        sessionId: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt.toISOString(),
        hasOrganizationContext: !!session.organizationId,
        lastActiveAt: session.lastActiveAt.toISOString()
      });

      return this.toSessionInfo(session);
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        throw error;
      }

      this.logger.error('Lỗi khi xác minh phiên làm việc', error as Error, {
        tokenLength: token ? token.length : 0,
        errorMessage: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Chấm dứt phiên làm việc.
   * @param sessionId - ID phiên làm việc cần chấm dứt
   * @returns Promise<void>
   */
  async terminateSession(sessionId: string): Promise<void> {
    this.logger.debug('Chấm dứt phiên làm việc', {
      sessionId
    });

    try {
      const result = await this.sessionRepository.delete({ id: sessionId });

      if (result.affected === 0) {
        throw new Error('Phiên làm việc không tồn tại');
      }

      this.logger.debug('Phiên làm việc đã bị chấm dứt', {
        sessionId
      });
    } catch (error) {
      this.logger.error('Lỗi khi chấm dứt phiên làm việc', error as Error, {
        sessionId
      });
      throw error;
    }
  }

  /**
   * Chấm dứt tất cả phiên làm việc của người dùng.
   * Hỗ trợ đăng xuất từ xa tức thời khi quyền bị thay đổi hoặc tài khoản bị vô hiệu hóa.
   * @param userId - ID của người dùng
   * @returns Promise<number> - Số phiên làm việc đã chấm dứt
   */
  async terminateAllUserSessions(userId: string): Promise<number> {
    this.logger.debug('Chấm dứt tất cả phiên làm việc của người dùng', {
      userId
    });

    try {
      const result = await this.sessionRepository.delete({ userId });

      this.logger.debug('Đã chấm dứt phiên làm việc của người dùng', {
        userId,
        sessionsTerminated: result.affected || 0
      });

      return result.affected || 0;
    } catch (error) {
      this.logger.error('Lỗi khi chấm dứt tất cả phiên làm việc của người dùng', error as Error, {
        userId
      });
      throw error;
    }
  }

  /**
   * Lấy danh sách phiên làm việc của người dùng.
   * @param userId - ID của người dùng
   * @returns Promise<SessionInfo[]> - Danh sách phiên làm việc
   */
  async getUserSessions(userId: string): Promise<SessionInfo[]> {
    this.logger.debug('Lấy danh sách phiên làm việc của người dùng', {
      userId
    });

    try {
      const sessions = await this.sessionRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });

      this.logger.debug('Đã lấy danh sách phiên làm việc của người dùng', {
        userId,
        sessionCount: sessions.length
      });

      return sessions.map(s => this.toSessionInfo(s));
    } catch (error) {
      this.logger.error('Lỗi khi lấy danh sách phiên làm việc của người dùng', error as Error, {
        userId
      });
      throw error;
    }
  }

  /**
   * Xóa các phiên làm việc đã hết hạn.
   * Phương thức này nên được gọi định kỳ bởi một scheduler.
   * @returns Promise<number> - Số lượng phiên làm việc đã xóa
   */
  async cleanupExpiredSessions(): Promise<number> {
    const now = new Date();
    this.logger.debug('Xóa các phiên làm việc đã hết hạn', {
      currentTime: now.toISOString()
    });

    try {
      const result = await this.sessionRepository
        .createQueryBuilder()
        .delete()
        .where('expiresAt < :now', { now })
        .execute();

      this.logger.debug('Đã xóa các phiên làm việc hết hạn', {
        deletedCount: result.affected || 0
      });

      return result.affected || 0;
    } catch (error) {
      this.logger.error('Lỗi khi xóa các phiên làm việc hết hạn', error as Error);
      throw error;
    }
  }

  /**
   * Chuyển đổi session entity sang session info DTO.
   * @param session - Session entity
   * @returns SessionInfo - DTO của session
   */
  private toSessionInfo(session: SessionEntity): SessionInfo {
    return {
      id: session.id,
      userId: session.userId,
      organizationId: session.organizationId,
      token: session.token,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      lastActiveAt: session.lastActiveAt
    };
  }
}
