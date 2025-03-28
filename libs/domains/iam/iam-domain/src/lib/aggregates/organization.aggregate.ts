import { AbstractAggregate, Result } from '@ecoma/common-domain';
import { v4 as uuidv4 } from 'uuid';
import {
  OrganizationSlug,
  OrganizationStatus
} from '../value-objects';
import { Membership } from '../entities/membership.entity';

/**
 * Aggregate Root đại diện cho một tổ chức trong hệ thống.
 */
export class Organization extends AbstractAggregate<any> {
  /**
   * Tên tổ chức.
   */
  private $name!: string;

  /**
   * Slug của tổ chức (dùng cho subdomain).
   */
  private $slug!: OrganizationSlug;

  /**
   * Trạng thái tổ chức.
   */
  private $status!: OrganizationStatus;

  /**
   * Quốc gia của tổ chức.
   */
  private $country!: string;

  /**
   * ID tham chiếu đến asset logo của tổ chức.
   */
  private $logoAssetId?: string;

  /**
   * Danh sách các thành viên (Membership Entities) trong tổ chức.
   */
  private $members: Membership[] = [];

  /**
   * Thời điểm tạo tổ chức.
   */
  private $createdAt!: Date;

  /**
   * Thời điểm cập nhật cuối cùng.
   */
  private $updatedAt!: Date;

  // Getters

  /**
   * Lấy ID dưới dạng chuỗi
   */
  public get idValue(): string {
    return this.id.toString();
  }

  public get name(): string {
    return this.$name;
  }

  public get slug(): OrganizationSlug {
    return this.$slug;
  }

  public get status(): OrganizationStatus {
    return this.$status;
  }

  public get country(): string {
    return this.$country;
  }

  public get logoAssetId(): string | undefined {
    return this.$logoAssetId;
  }

  public get members(): readonly Membership[] {
    return Object.freeze([...this.$members]);
  }

  public get createdAt(): Date {
    return this.$createdAt;
  }

  public get updatedAt(): Date {
    return this.$updatedAt;
  }

  /**
   * Constructor riêng tư. Sử dụng các phương thức factory để tạo thực thể.
   */
  private constructor(id: string) {
    super(id);
  }

  /**
   * Factory method để tạo tổ chức mới.
   */
  public static create(
    name: string,
    slug: OrganizationSlug,
    country: string,
    logoAssetId?: string
  ): Result<Organization> {
    try {
      const organization = new Organization(uuidv4());
      const now = new Date();

      organization.$name = name;
      organization.$slug = slug;
      organization.$status = OrganizationStatus.ACTIVE;
      organization.$country = country;
      organization.$logoAssetId = logoAssetId;
      organization.$createdAt = now;
      organization.$updatedAt = now;

      return Result.ok(organization);
    } catch (error) {
      return Result.fail<Organization>((error as Error).message);
    }
  }

  /**
   * Cập nhật thông tin tổ chức.
   */
  public update(name: string, logoAssetId?: string): Result<void> {
    try {
      this.$name = name;
      this.$logoAssetId = logoAssetId;
      this.$updatedAt = new Date();
      return Result.ok();
    } catch (error) {
      return Result.fail((error as Error).message);
    }
  }

  /**
   * Tạm ngưng tổ chức.
   */
  public suspend(): Result<void> {
    if (this.$status === OrganizationStatus.SUSPENDED) {
      return Result.fail('Tổ chức đã ở trạng thái tạm ngưng');
    }

    this.$status = OrganizationStatus.SUSPENDED;
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Kích hoạt lại tổ chức đã bị tạm ngưng.
   */
  public activate(): Result<void> {
    if (this.$status === OrganizationStatus.ACTIVE) {
      return Result.fail('Tổ chức đã ở trạng thái hoạt động');
    }

    this.$status = OrganizationStatus.ACTIVE;
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Thêm thành viên vào tổ chức.
   */
  public addMember(membership: Membership): Result<void> {
    // Kiểm tra xem thành viên đã tồn tại trong tổ chức chưa
    const existingMember = this.$members.find(m => m.getUserId === membership.getUserId);
    if (existingMember) {
      return Result.fail('Người dùng đã là thành viên của tổ chức này');
    }

    this.$members.push(membership);
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Xóa thành viên khỏi tổ chức.
   */
  public removeMember(userId: string): Result<void> {
    const initialLength = this.$members.length;
    this.$members = this.$members.filter(m => m.getUserId !== userId);

    if (this.$members.length === initialLength) {
      return Result.fail('Không tìm thấy thành viên với ID đã chỉ định');
    }

    this.$updatedAt = new Date();
    return Result.ok();
  }

  /**
   * Cập nhật vai trò của thành viên trong tổ chức.
   */
  public updateMemberRole(userId: string, roleId: string): Result<void> {
    const member = this.$members.find(m => m.getUserId === userId);

    if (!member) {
      return Result.fail('Không tìm thấy thành viên với ID đã chỉ định');
    }

    try {
      member.changeRole(roleId);
      this.$updatedAt = new Date();
      return Result.ok();
    } catch (error) {
      return Result.fail((error as Error).message);
    }
  }

  /**
   * Phục hồi Organization từ dữ liệu.
   */
  public static restore(data: {
    id: string;
    name: string;
    slug: OrganizationSlug;
    status: OrganizationStatus;
    country: string;
    logoAssetId?: string;
    members: Membership[];
    createdAt: Date;
    updatedAt: Date;
  }): Organization {
    const organization = new Organization(data.id);

    organization.$name = data.name;
    organization.$slug = data.slug;
    organization.$status = data.status;
    organization.$country = data.country;
    organization.$logoAssetId = data.logoAssetId;
    organization.$members = data.members;
    organization.$createdAt = data.createdAt;
    organization.$updatedAt = data.updatedAt;

    return organization;
  }
}
