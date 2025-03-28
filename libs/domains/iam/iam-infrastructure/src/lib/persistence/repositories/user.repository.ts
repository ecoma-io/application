import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, IUserRepository, EmailAddress } from '@ecoma/iam-domain';
import { UserMapper } from '../typeorm/mappers/user.mapper';
import { UserEntity } from '../typeorm/entities/user.entity';
import { ILogger } from '@ecoma/common-application';

/**
 * Triển khai UserRepository sử dụng TypeORM.
 */
@Injectable()
export class UserRepository implements IUserRepository {
  /**
   * Constructor.
   * @param userRepository - TypeORM repository
   * @param logger - Logger service
   */
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject('ILogger')
    private readonly logger: ILogger
  ) {}

  /**
   * Tìm User theo ID.
   * @param id - ID của User
   * @returns Promise<User | null> - User nếu tìm thấy, null nếu không
   */
  async findById(id: string): Promise<User | null> {
    this.logger.debug('Tìm User theo ID', { id });

    try {
      const entity = await this.userRepository.findOne({ where: { id } });

      if (!entity) {
        this.logger.debug('Không tìm thấy User với ID', { id });
        return null;
      }

      this.logger.debug('Đã tìm thấy User với ID', { id, email: entity.email });
      return UserMapper.toDomain(entity);
    } catch (error) {
      this.logger.error('Lỗi khi tìm User theo ID', error as Error, { id });
      throw error;
    }
  }

  /**
   * Tìm User theo email.
   * @param email - Email cần tìm
   * @returns Promise<User | null> - User nếu tìm thấy, null nếu không
   */
  async findByEmail(email: EmailAddress): Promise<User | null> {
    this.logger.debug('Tìm User theo email', { email: email.value });

    try {
      const entity = await this.userRepository.findOne({
        where: { email: email.value }
      });

      if (!entity) {
        this.logger.debug('Không tìm thấy User với email', { email: email.value });
        return null;
      }

      this.logger.debug('Đã tìm thấy User với email', { email: email.value, id: entity.id });
      return UserMapper.toDomain(entity);
    } catch (error) {
      this.logger.error('Lỗi khi tìm User theo email', error as Error, { email: email.value });
      throw error;
    }
  }

  /**
   * Tìm User theo token xác minh email.
   * @param token - Token xác minh email
   * @returns Promise<User | null> - User nếu tìm thấy, null nếu không
   */
  async findByEmailVerificationToken(token: string): Promise<User | null> {
    this.logger.debug('Tìm User theo token xác minh email', { tokenLength: token.length });

    try {
      const entity = await this.userRepository.findOne({
        where: { emailVerificationToken: token }
      });

      if (!entity) {
        this.logger.debug('Không tìm thấy User với token xác minh email');
        return null;
      }

      this.logger.debug('Đã tìm thấy User với token xác minh email', { id: entity.id, email: entity.email });
      return UserMapper.toDomain(entity);
    } catch (error) {
      this.logger.error('Lỗi khi tìm User theo token xác minh email', error as Error);
      throw error;
    }
  }

  /**
   * Tìm User theo token đặt lại mật khẩu.
   * @param token - Token đặt lại mật khẩu
   * @returns Promise<User | null> - User nếu tìm thấy, null nếu không
   */
  async findByPasswordResetToken(token: string): Promise<User | null> {
    this.logger.debug('Tìm User theo token đặt lại mật khẩu', { tokenLength: token.length });

    try {
      const entity = await this.userRepository.findOne({
        where: { passwordResetToken: token }
      });

      if (!entity) {
        this.logger.debug('Không tìm thấy User với token đặt lại mật khẩu');
        return null;
      }

      this.logger.debug('Đã tìm thấy User với token đặt lại mật khẩu', { id: entity.id, email: entity.email });
      return UserMapper.toDomain(entity);
    } catch (error) {
      this.logger.error('Lỗi khi tìm User theo token đặt lại mật khẩu', error as Error);
      throw error;
    }
  }

  /**
   * Lưu User.
   * @param user - User cần lưu
   * @returns Promise<User> - User đã lưu
   */
  async save(user: User): Promise<User> {
    this.logger.debug('Lưu User', { id: user.id, email: user.email.value });

    try {
      const entity = UserMapper.toPersistence(user);
      const savedEntity = await this.userRepository.save(entity);

      this.logger.debug('User đã được lưu thành công', { id: savedEntity.id });
      return UserMapper.toDomain(savedEntity);
    } catch (error) {
      this.logger.error('Lỗi khi lưu User', error as Error, { id: user.id, email: user.email.value });
      throw error;
    }
  }

  /**
   * Xóa User.
   * @param user - User cần xóa
   * @returns Promise<void>
   */
  async delete(user: User): Promise<void> {
    this.logger.info('Xóa User', { id: user.id, email: user.email.value });

    try {
      await this.userRepository.delete(user.id);
      this.logger.info('User đã được xóa thành công', { id: user.id });
    } catch (error) {
      this.logger.error('Lỗi khi xóa User', error as Error, { id: user.id });
      throw error;
    }
  }
}
