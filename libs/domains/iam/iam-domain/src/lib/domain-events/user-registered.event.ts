import { AbstractDomainEvent } from '@ecoma/common-domain';
import { UserProfile } from '../value-objects';

/**
 * Domain Event phát ra khi người dùng mới đăng ký thành công.
 *
 * @since 1.0.0
 */
export class UserRegisteredEvent extends AbstractDomainEvent {
  /**
   * Khởi tạo một instance mới của UserRegisteredEvent.
   *
   * @param userId - ID của người dùng đã đăng ký
   * @param email - Email của người dùng
   * @param profile - Thông tin hồ sơ của người dùng
   * @param requiresEmailVerification - Có yêu cầu xác minh email không
   */
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly profile: UserProfile,
    public readonly requiresEmailVerification: boolean
  ) {
    super();
  }
}
