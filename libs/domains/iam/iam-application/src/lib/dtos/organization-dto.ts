import { OrganizationStatus } from '@ecoma/iam-domain';
import { IMembershipDto } from './membership-dto';

/**
 * DTO cho thông tin Organization.
 */
export interface IOrganizationDto {
  /**
   * ID của tổ chức.
   */
  id: string;

  /**
   * Tên tổ chức.
   */
  name: string;

  /**
   * Slug của tổ chức (dùng cho subdomain).
   */
  slug: string;

  /**
   * Trạng thái tổ chức.
   */
  status: OrganizationStatus;

  /**
   * Quốc gia của tổ chức.
   */
  country: string;

  /**
   * ID tham chiếu đến asset logo của tổ chức.
   */
  logoAssetId?: string;

  /**
   * Danh sách thành viên của tổ chức (tùy chọn).
   */
  members?: IMembershipDto[];

  /**
   * Thời điểm tạo tổ chức.
   */
  createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng.
   */
  updatedAt: Date;
}

/**
 * Concrete DTO class for Organization
 */
export class OrganizationDto implements IOrganizationDto {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  country: string;
  logoAssetId?: string;
  members?: IMembershipDto[];
  createdAt: Date;
  updatedAt: Date;

  constructor(data: IOrganizationDto) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.status = data.status;
    this.country = data.country;
    this.logoAssetId = data.logoAssetId;
    this.members = data.members;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
