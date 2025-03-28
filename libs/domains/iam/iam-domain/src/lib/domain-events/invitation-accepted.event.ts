import { AbstractDomainEvent } from '@ecoma/common-domain';

/**
 * Domain Event phát ra khi một lời mời tham gia tổ chức được chấp nhận.
 *
 * @since 1.0.0
 */
export class InvitationAcceptedEvent extends AbstractDomainEvent {
  /**
   * Khởi tạo một instance mới của InvitationAcceptedEvent.
   *
   * @param invitationId - ID của lời mời
   * @param organizationId - ID của tổ chức
   * @param userId - ID của người dùng chấp nhận lời mời
   * @param roleId - ID của vai trò được gán cho người dùng
   * @param inviteeEmail - Email của người được mời
   */
  constructor(
    public readonly invitationId: string,
    public readonly organizationId: string,
    public readonly userId: string,
    public readonly roleId: string,
    public readonly inviteeEmail: string
  ) {
    super();
  }
}
