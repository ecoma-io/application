import { AbstractAggregate, Result } from '@ecoma/common-domain';
import { StringId } from '../value-objects/string-id.value-object';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entity đại diện cho mối quan hệ thành viên giữa người dùng và tổ chức.
 *
 * @since 1.0.0
 */
export class Membership extends AbstractAggregate<StringId> {
  /**
   * ID của người dùng.
   */
  private userId: string;

  /**
   * ID của tổ chức (null cho membership nội bộ).
   */
  private organizationId: string | null;

  /**
   * ID của vai trò được gán cho người dùng trong tổ chức.
   */
  private roleId: string;

  /**
   * Thời điểm người dùng tham gia tổ chức.
   */
  private joinedAt: Date;

  /**
   * Khởi tạo một instance mới của Membership.
   *
   * @param id - ID duy nhất của membership
   * @param userId - ID của người dùng
   * @param organizationId - ID của tổ chức (null cho membership nội bộ)
   * @param roleId - ID của vai trò được gán cho người dùng
   * @param joinedAt - Thời điểm người dùng tham gia tổ chức
   */
  constructor(
    id: string,
    userId: string,
    organizationId: string | null,
    roleId: string,
    joinedAt: Date = new Date()
  ) {
    super(new StringId(id));
    this.userId = userId;
    this.organizationId = organizationId;
    this.roleId = roleId;
    this.joinedAt = joinedAt;

    this.validateState();
  }

  /**
   * Tạo membership mới với vai trò owner
   *
   * @param userId - ID của người dùng
   * @param organizationId - ID của tổ chức
   * @returns Kết quả chứa Membership mới hoặc lỗi
   */
  public static createOwner(userId: string, organizationId: string): Result<Membership> {
    try {
      const id = uuidv4();
      const ownerRoleId = 'owner'; // Giả sử "owner" là ID của vai trò chủ sở hữu

      const membership = new Membership(
        id,
        userId,
        organizationId,
        ownerRoleId
      );

      return Result.ok(membership);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to create owner membership');
    }
  }

  /**
   * Lấy ID của người dùng.
   */
  get getUserId(): string {
    return this.userId;
  }

  /**
   * Lấy ID của tổ chức.
   */
  get getOrganizationId(): string | null {
    return this.organizationId;
  }

  /**
   * Lấy ID của vai trò.
   */
  get getRoleId(): string {
    return this.roleId;
  }

  /**
   * Lấy thời điểm tham gia.
   */
  get getJoinedAt(): Date {
    return new Date(this.joinedAt);
  }

  /**
   * Thay đổi vai trò của thành viên.
   *
   * @param newRoleId - ID của vai trò mới
   */
  public changeRole(newRoleId: string): void {
    if (!newRoleId) {
      throw new Error('ID vai trò không được để trống');
    }

    this.roleId = newRoleId;
  }

  /**
   * Kiểm tra xem có phải là membership nội bộ không.
   *
   * @returns true nếu là membership nội bộ, ngược lại false
   */
  public isInternalMembership(): boolean {
    return this.organizationId === null;
  }

  /**
   * Kiểm tra tính hợp lệ của trạng thái.
   *
   * @throws Error - Nếu trạng thái không hợp lệ
   */
  private validateState(): void {
    if (!this.userId) {
      throw new Error('ID người dùng không được để trống');
    }

    if (!this.roleId) {
      throw new Error('ID vai trò không được để trống');
    }
  }

  /**
   * Lấy giá trị ID dưới dạng chuỗi.
   */
  get idValue(): string {
    return this.id.value;
  }
}
