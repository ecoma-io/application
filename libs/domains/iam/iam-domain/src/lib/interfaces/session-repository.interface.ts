import { IRepository } from '@ecoma/common-domain';
import { Session } from '../entities/session.entity';
import { StringId } from '../value-objects/string-id.value-object';

/**
 * Interface cho repository quản lý Session Entity.
 * Hỗ trợ Session Token Stateful cho phép vô hiệu hóa phiên từ xa tức thời,
 * cập nhật quyền theo thời gian thực, và quản lý đa phiên.
 *
 * @since 1.0.0
 */
export interface ISessionRepository extends IRepository<StringId, Session> {
  /**
   * Tìm kiếm Session theo token.
   *
   * @param token - Token phiên làm việc cần tìm
   * @returns Promise chứa Session nếu tìm thấy, null nếu không
   */
  findByToken(token: string): Promise<Session | null>;

  /**
   * Tìm tất cả các Session của một người dùng.
   *
   * @param userId - ID của người dùng
   * @returns Promise chứa danh sách các Session
   */
  findByUserId(userId: string): Promise<Session[]>;

  /**
   * Tìm tất cả các Session của một người dùng trong một tổ chức.
   *
   * @param userId - ID của người dùng
   * @param organizationId - ID của tổ chức
   * @returns Promise chứa danh sách các Session
   */
  findByUserIdAndOrganizationId(userId: string, organizationId: string): Promise<Session[]>;

  /**
   * Xóa tất cả các Session của một người dùng.
   * Hỗ trợ đăng xuất tất cả phiên của một người dùng.
   *
   * @param userId - ID của người dùng
   * @returns Promise chứa số lượng Session đã xóa
   */
  deleteByUserId(userId: string): Promise<number>;

  /**
   * Xóa tất cả các Session của một tổ chức.
   * Hỗ trợ vô hiệu hóa tất cả phiên làm việc khi tổ chức bị đình chỉ.
   *
   * @param organizationId - ID của tổ chức
   * @returns Promise chứa số lượng Session đã xóa
   */
  deleteByOrganizationId(organizationId: string): Promise<number>;

  /**
   * Cập nhật thời điểm hoạt động cuối cùng của Session.
   *
   * @param token - Token phiên làm việc
   * @returns Promise<boolean> - true nếu cập nhật thành công, false nếu không tìm thấy
   */
  updateLastActiveAt(token: string): Promise<boolean>;

  /**
   * Xóa tất cả các Session đã hết hạn.
   *
   * @returns Promise chứa số lượng Session đã xóa
   */
  cleanupExpiredSessions(): Promise<number>;
}
