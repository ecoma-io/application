import { AbstractDomainEvent } from '@ecoma/common-domain';
import { OrganizationSlug } from '../value-objects';

/**
 * Domain Event phát ra khi một tổ chức mới được tạo.
 *
 * @since 1.0.0
 */
export class OrganizationCreatedEvent extends AbstractDomainEvent {
  /**
   * Khởi tạo một instance mới của OrganizationCreatedEvent.
   *
   * @param organizationId - ID của tổ chức mới
   * @param name - Tên của tổ chức
   * @param slug - Slug của tổ chức
   * @param ownerUserId - ID của người dùng tạo tổ chức (Owner)
   * @param country - Quốc gia của tổ chức
   */
  constructor(
    public readonly organizationId: string,
    public readonly name: string,
    public readonly slug: OrganizationSlug,
    public readonly ownerUserId: string,
    public readonly country: string
  ) {
    super();
  }
}
