import { AggregateRoot, Result } from '@ecoma/common-domain';
import { v4 as uuidv4 } from 'uuid';
import { OrganizationSlug, OrganizationStatus } from '../value-objects';
import { Membership } from '../entities/membership.entity';

/**
 * Class đại diện cho Organization.
 */
export class Organization extends AggregateRoot {
  /**
   * Tên tổ chức.
   */
  private $name: string;

  /**
   * Slug của tổ chức (dùng cho subdomain).
   */
  private $slug: OrganizationSlug;

  /**
   * Trạng thái tổ chức.
   */
  private $status: OrganizationStatus;

  /**
   * Quốc gia của tổ chức.
   */
  private $country: string;

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
  private $createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng.
   */
  private $updatedAt: Date;

  /**
   * Constructor riêng tư. Sử dụng các phương thức static để tạo đối tượng.
   */
  private constructor(id: string) {
    super(id);
  }

  /**
   * Phương thức để lấy name.
   */
  public get name(): string {
    return this.$name;
  }

  /**
   * Phương thức để lấy slug.
   */
  public get slug(): OrganizationSlug {
    return this.$slug;
  }

  /**
   * Phương thức để lấy status.
   */
  public get status(): OrganizationStatus {
    return this.$status;
  }

  /**
   * Phương thức để lấy country.
   */
  public get country(): string {
    return this.$country;
  }

  /**
   * Phương thức để lấy logoAssetId.
   */
  public get logoAssetId(): string | undefined {
    return this.$logoAssetId;
  }

  /**
   * Phương thức để lấy danh sách members (chỉ đọc).
   */
  public get members(): readonly Membership[] {
    return Object.freeze([...this.$members]);
  }

  /**
   * Phương thức để lấy createdAt.
   */
  public get createdAt(): Date {
    return this.$createdAt;
  }

  /**
   * Phương thức để lấy updatedAt.
   */
  public get updatedAt(): Date {
    return this.$updatedAt;
  }

  /**
   * Factory method để tạo tổ chức mới.
   * @param name - Tên tổ chức
   * @param slug - Slug của tổ chức
   * @param country - Quốc gia của tổ chức
   * @param logoAssetId - ID tham chiếu đến asset logo (tùy chọn)
   * @returns Result chứa Organization nếu thành công, error nếu thất bại
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
      organization.$status = OrganizationStatus.Active;
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
   * @param name - Tên tổ chức mới
   * @param logoAssetId - ID tham chiếu đến asset logo mới (tùy chọn)
   * @returns Result<void> - Kết quả cập nhật
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
   * Tạm ngưng hoạt động của tổ chức.
   * @returns Result<void> - Kết quả tạm ngưng
   */
  public suspend(): Result<void> {
    if (this.$status === OrganizationStatus.Suspended) {
      return Result.fail('Tổ chức đã ở trạng thái tạm ngưng');
    }

    this.$status = OrganizationStatus.Suspended;
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Kích hoạt lại tổ chức.
   * @returns Result<void> - Kết quả kích hoạt
   */
  public activate(): Result<void> {
    if (this.$status === OrganizationStatus.Active) {
      return Result.fail('Tổ chức đã ở trạng thái hoạt động');
    }

    this.$status = OrganizationStatus.Active;
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Thêm thành viên vào tổ chức.
   * @param membership - Membership Entity đại diện cho thành viên mới
   * @returns Result<void> - Kết quả thêm thành viên
   */
  public addMember(membership: Membership): Result<void> {
    // Kiểm tra xem thành viên đã tồn tại trong tổ chức chưa
    const existingMember = this.$members.find(m => m.userId === membership.userId);
    if (existingMember) {
      return Result.fail('Người dùng đã là thành viên của tổ chức này');
    }

    this.$members.push(membership);
    this.$updatedAt = new Date();

    return Result.ok();
  }

  /**
   * Xóa thành viên khỏi tổ chức.
   * @param userId - ID của người dùng cần xóa khỏi tổ chức
   * @returns Result<void> - Kết quả xóa thành viên
   */
  public removeMember(userId: string): Result<void> {
    const initialLength = this.$members.length;
    this.$members = this.$members.filter(m => m.userId !== userId);

    if (this.$members.length === initialLength) {
      return Result.fail('Không tìm thấy thành viên với ID đã chỉ định');
    }

    this.$updatedAt = new Date();
    return Result.ok();
  }

  /**
   * Cập nhật vai trò của thành viên trong tổ chức.
   * @param userId - ID của người dùng cần cập nhật vai trò
   * @param roleId - ID vai trò mới
   * @returns Result<void> - Kết quả cập nhật vai trò
   */
  public updateMemberRole(userId: string, roleId: string): Result<void> {
    const member = this.$members.find(m => m.userId === userId);
    
    if (!member) {
      return Result.fail('Không tìm thấy thành viên với ID đã chỉ định');
    }

    member.updateRole(roleId);
    this.$updatedAt = new Date();
    return Result.ok();
  }

  /**
   * Phương thức phục hồi Organization từ persistence.
   * @param data - Dữ liệu Organization
   * @returns Organization - Đối tượng Organization
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