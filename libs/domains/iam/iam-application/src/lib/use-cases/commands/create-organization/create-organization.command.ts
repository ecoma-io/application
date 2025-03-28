import { ICommand } from '@nestjs/cqrs';

/**
 * Command tạo tổ chức mới.
 */
export class CreateOrganizationCommand implements ICommand {
  /**
   * Tạo command tạo tổ chức mới.
   * @param name - Tên tổ chức
   * @param slug - Slug của tổ chức (sử dụng cho subdomain)
   * @param country - Quốc gia của tổ chức
   * @param logoAssetId - ID tham chiếu đến asset logo (tùy chọn)
   * @param ownerId - ID của người dùng sẽ là chủ sở hữu tổ chức
   */
  constructor(
    public readonly name: string,
    public readonly slug: string,
    public readonly country: string,
    public readonly ownerId: string,
    public readonly logoAssetId?: string
  ) {}
} 