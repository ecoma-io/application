import { IRepository, Email } from '@ecoma/common-domain';
import { User } from '../aggregates/user.aggregate';

/**
 * Interface cho repository quản lý User Aggregate.
 */
export interface IUserRepository extends IRepository<any, User> {
  /**
   * Tìm kiếm User theo email.
   * @param email - Email cần tìm
   * @returns Promise chứa User nếu tìm thấy, null nếu không
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Tìm kiếm User theo token xác minh email.
   * @param token - Token xác minh email
   * @returns Promise chứa User nếu tìm thấy, null nếu không
   */
  findByEmailVerificationToken(token: string): Promise<User | null>;

  /**
   * Tìm kiếm User theo token đặt lại mật khẩu.
   * @param token - Token đặt lại mật khẩu
   * @returns Promise chứa User nếu tìm thấy, null nếu không
   */
  findByPasswordResetToken(token: string): Promise<User | null>;
}
