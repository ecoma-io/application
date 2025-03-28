import { AbstractDomainEvent } from '@ecoma/common-domain';

/**
 * Domain Event phát ra khi người dùng tham gia một tổ chức.
 *
 * @since 1.0.0
 */
export class UserJoinedOrganizationEvent extends AbstractDomainEvent {
  /**
   * Khởi tạo một instance mới của UserJoinedOrganizationEvent.
   *
   * @param userId - ID của người dùng tham gia
   * @param organizationId - ID của tổ chức
   * @param roleId - ID của vai trò được gán cho người dùng
   * @param membershipId - ID của membership mới được tạo
   * @param joinedAt - Thời điểm tham gia
   */
  constructor(
    public readonly userId: string,
    public readonly organizationId: string,
    public readonly roleId: string,
    public readonly membershipId: string,
    public readonly joinedAt: Date
  ) {
    super();
  }
}
