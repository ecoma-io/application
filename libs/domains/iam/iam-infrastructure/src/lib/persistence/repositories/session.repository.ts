import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Session, ISessionRepository, StringId } from '@ecoma/iam-domain';
import { SessionEntity } from '../typeorm/entities/session.entity';
import { SessionMapper } from '../typeorm/mappers/session.mapper';
import { ILogger } from '@ecoma/common-application';

/**
 * Triển khai SessionRepository sử dụng TypeORM.
 * Hỗ trợ Session Token Stateful cho vô hiệu hóa phiên từ xa tức thời,
 * cập nhật quyền theo thời gian thực, và quản lý đa phiên.
 */
@Injectable()
export class SessionRepository implements ISessionRepository {
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
   * Tìm Session theo ID.
   * @param id - ID của Session
   * @returns Promise<Session | null> - Session nếu tìm thấy, null nếu không
   */
  async findById(id: StringId): Promise<Session | null> {
    this.logger.debug('Tìm Session theo ID', { id: id.toString() });

    try {
      const entity = await this.sessionRepository.findOne({ where: { id: id.toString() } });

      if (!entity) {
        this.logger.debug('Không tìm thấy Session với ID', { id: id.toString() });
        return null;
      }

      this.logger.debug('Đã tìm thấy Session với ID', { id: id.toString(), userId: entity.userId });
      return SessionMapper.toDomain(entity);
    } catch (error) {
      this.logger.error('Lỗi khi tìm Session theo ID', error as Error, { id: id.toString() });
      throw error;
    }
  }

  /**
   * Tìm kiếm Session theo token.
   * @param token - Token phiên làm việc cần tìm
   * @returns Promise<Session | null> - Session nếu tìm thấy, null nếu không
   */
  async findByToken(token: string): Promise<Session | null> {
    this.logger.debug('Tìm Session theo token', { tokenLength: token.length });

    try {
      const entity = await this.sessionRepository.findOne({ where: { token } });

      if (!entity) {
        this.logger.debug('Không tìm thấy Session với token');
        return null;
      }

      this.logger.debug('Đã tìm thấy Session với token', {
        id: entity.id,
        userId: entity.userId,
        expiresAt: entity.expiresAt.toISOString()
      });
      return SessionMapper.toDomain(entity);
    } catch (error) {
      this.logger.error('Lỗi khi tìm Session theo token', error as Error);
      throw error;
    }
  }

  /**
   * Tìm tất cả các Session của một người dùng.
   * @param userId - ID của người dùng
   * @returns Promise<Session[]> - Danh sách các Session
   */
  async findByUserId(userId: string): Promise<Session[]> {
    this.logger.debug('Tìm tất cả Session của người dùng', { userId });

    try {
      const entities = await this.sessionRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' }
      });

      this.logger.debug('Đã tìm thấy Session của người dùng', {
        userId,
        count: entities.length
      });
      return entities.map(entity => SessionMapper.toDomain(entity));
    } catch (error) {
      this.logger.error('Lỗi khi tìm Session theo userId', error as Error, { userId });
      throw error;
    }
  }

  /**
   * Tìm tất cả các Session của một người dùng trong một tổ chức.
   * @param userId - ID của người dùng
   * @param organizationId - ID của tổ chức
   * @returns Promise<Session[]> - Danh sách các Session
   */
  async findByUserIdAndOrganizationId(userId: string, organizationId: string): Promise<Session[]> {
    this.logger.debug('Tìm Session theo userId và organizationId', { userId, organizationId });

    try {
      const entities = await this.sessionRepository.find({
        where: { userId, organizationId },
        order: { createdAt: 'DESC' }
      });

      this.logger.debug('Đã tìm thấy Session theo userId và organizationId', {
        userId,
        organizationId,
        count: entities.length
      });
      return entities.map(entity => SessionMapper.toDomain(entity));
    } catch (error) {
      this.logger.error('Lỗi khi tìm Session theo userId và organizationId', error as Error, {
        userId,
        organizationId
      });
      throw error;
    }
  }

  /**
   * Lưu Session.
   * @param session - Session cần lưu
   * @returns Promise<Session> - Session đã lưu
   */
  async save(session: Session): Promise<Session> {
    this.logger.debug('Lưu Session', { id: session.id.toString() });

    try {
      const entity = SessionMapper.toPersistence(session);
      const savedEntity = await this.sessionRepository.save(entity);

      this.logger.debug('Session đã được lưu thành công', { id: savedEntity.id });
      return SessionMapper.toDomain(savedEntity);
    } catch (error) {
      this.logger.error('Lỗi khi lưu Session', error as Error, { id: session.id.toString() });
      throw error;
    }
  }

  /**
   * Xóa tất cả các Session của một người dùng.
   * @param userId - ID của người dùng
   * @returns Promise<number> - Số lượng Session đã xóa
   */
  async deleteByUserId(userId: string): Promise<number> {
    this.logger.debug('Xóa tất cả Session của người dùng', { userId });

    try {
      const result = await this.sessionRepository.delete({ userId });

      this.logger.debug('Đã xóa Session của người dùng', {
        userId,
        count: result.affected || 0
      });
      return result.affected || 0;
    } catch (error) {
      this.logger.error('Lỗi khi xóa Session theo userId', error as Error, { userId });
      throw error;
    }
  }

  /**
   * Xóa tất cả các Session của một tổ chức.
   * @param organizationId - ID của tổ chức
   * @returns Promise<number> - Số lượng Session đã xóa
   */
  async deleteByOrganizationId(organizationId: string): Promise<number> {
    this.logger.debug('Xóa tất cả Session của tổ chức', { organizationId });

    try {
      const result = await this.sessionRepository.delete({ organizationId });

      this.logger.debug('Đã xóa Session của tổ chức', {
        organizationId,
        count: result.affected || 0
      });
      return result.affected || 0;
    } catch (error) {
      this.logger.error('Lỗi khi xóa Session theo organizationId', error as Error, { organizationId });
      throw error;
    }
  }

  /**
   * Cập nhật thời điểm hoạt động cuối cùng của Session.
   * @param token - Token phiên làm việc
   * @returns Promise<boolean> - true nếu cập nhật thành công, false nếu không tìm thấy
   */
  async updateLastActiveAt(token: string): Promise<boolean> {
    this.logger.debug('Cập nhật lastActiveAt cho Session', { tokenLength: token.length });

    try {
      const now = new Date();
      const result = await this.sessionRepository.update(
        { token },
        { lastActiveAt: now }
      );

      if (result.affected === 0) {
        this.logger.debug('Không tìm thấy Session để cập nhật lastActiveAt');
        return false;
      }

      this.logger.debug('Đã cập nhật lastActiveAt cho Session', {
        lastActiveAt: now.toISOString()
      });
      return true;
    } catch (error) {
      this.logger.error('Lỗi khi cập nhật lastActiveAt cho Session', error as Error);
      throw error;
    }
  }

  /**
   * Xóa tất cả các Session đã hết hạn.
   * @returns Promise<number> - Số lượng Session đã xóa
   */
  async cleanupExpiredSessions(): Promise<number> {
    const now = new Date();
    this.logger.debug('Xóa tất cả Session đã hết hạn', { currentTime: now.toISOString() });

    try {
      const result = await this.sessionRepository.delete({
        expiresAt: LessThan(now)
      });

      this.logger.debug('Đã xóa Session đã hết hạn', {
        count: result.affected || 0
      });
      return result.affected || 0;
    } catch (error) {
      this.logger.error('Lỗi khi xóa Session đã hết hạn', error as Error);
      throw error;
    }
  }
}
