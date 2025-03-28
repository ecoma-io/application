import { AbstractDomainEvent } from '@ecoma/common-domain';

/**
 * Domain Event phát ra khi địa chỉ email của người dùng được xác minh.
 *
 * @since 1.0.0
 */
export class EmailVerifiedEvent extends AbstractDomainEvent {
  /**
   * Khởi tạo một instance mới của EmailVerifiedEvent.
   *
   * @param userId - ID của người dùng đã xác minh email
   * @param email - Email đã được xác minh
   */
  constructor(
    public readonly userId: string,
    public readonly email: string
  ) {
    super();
  }
}
