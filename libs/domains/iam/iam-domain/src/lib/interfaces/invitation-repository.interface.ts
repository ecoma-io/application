import { IRepository } from '@ecoma/common-domain';
import { Invitation } from '../aggregates/invitation.aggregate';
import { InvitationStatus } from '../value-objects';

/**
 * Interface cho repository quản lý Invitation Aggregate.
 *
 * @since 1.0.0
 */
export interface IInvitationRepository extends IRepository<any, Invitation> {
  /**
   * Tìm kiếm Invitation theo token.
   *
   * @param token - Token của lời mời
   * @returns Promise chứa Invitation nếu tìm thấy, null nếu không
   */
  findByToken(token: string): Promise<Invitation | null>;

  /**
   * Tìm tất cả các lời mời đến một email cụ thể.
   *
   * @param email - Email người được mời
   * @returns Promise chứa danh sách các lời mời
   */
  findByInviteeEmail(email: string): Promise<Invitation[]>;

  /**
   * Tìm tất cả các lời mời trong một tổ chức.
   *
   * @param organizationId - ID của tổ chức
   * @param status - Trạng thái lời mời (tùy chọn)
   * @returns Promise chứa danh sách các lời mời
   */
  findByOrganizationId(organizationId: string, status?: InvitationStatus): Promise<Invitation[]>;

  /**
   * Tìm lời mời theo email người được mời và ID tổ chức.
   *
   * @param email - Email người được mời
   * @param organizationId - ID của tổ chức
   * @returns Promise chứa Invitation nếu tìm thấy, null nếu không
   */
  findByEmailAndOrganizationId(email: string, organizationId: string): Promise<Invitation | null>;

  /**
   * Tìm kiếm Invitation theo email người được mời.
   *
   * @param email - Email người được mời
   * @returns Promise chứa danh sách các Invitation
   */
  findByEmail(email: string): Promise<Invitation[]>;

  /**
   * Xóa tất cả các lời mời hết hạn.
   *
   * @returns Promise<number> - Số lượng lời mời đã xóa
   */
  cleanupExpiredInvitations(): Promise<number>;
}
