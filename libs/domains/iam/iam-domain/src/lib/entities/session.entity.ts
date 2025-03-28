import { AbstractEntity } from '@ecoma/common-domain';
import { StringId } from '../value-objects/string-id.value-object';

/**
 * Entity đại diện cho một phiên làm việc của người dùng.
 * Phiên làm việc stateful lưu trữ token trong database để hỗ trợ các tính năng:
 * - Vô hiệu hóa phiên từ xa tức thời
 * - Cập nhật quyền theo thời gian thực
 * - Đồng bộ trạng thái tổ chức
 * - Quản lý đa phiên
 *
 * @since 1.0.0
 */
export class Session extends AbstractEntity<StringId> {
  /**
   * ID của người dùng sở hữu phiên làm việc.
   */
  private userId: string;

  /**
   * ID của tổ chức liên quan đến phiên làm việc (null cho phiên nội bộ).
   */
  private organizationId: string | null;

  /**
   * Token xác thực duy nhất của phiên làm việc.
   */
  private token: string;

  /**
   * Thời điểm hết hạn của phiên làm việc.
   */
  private expiresAt: Date;

  /**
   * Thời điểm tạo phiên làm việc.
   */
  private createdAt: Date;

  /**
   * Thời điểm hoạt động cuối cùng của phiên làm việc.
   * Hỗ trợ phát hiện phiên không hoạt động.
   */
  private lastActiveAt: Date;

  /**
   * Khởi tạo một instance mới của Session.
   *
   * @param id - ID duy nhất của phiên làm việc
   * @param userId - ID của người dùng sở hữu phiên làm việc
   * @param organizationId - ID của tổ chức (null cho phiên nội bộ)
   * @param token - Token xác thực duy nhất
   * @param expiresAt - Thời điểm hết hạn của phiên làm việc
   * @param createdAt - Thời điểm tạo phiên làm việc
   * @param lastActiveAt - Thời điểm hoạt động cuối cùng
   */
  constructor(
    id: string,
    userId: string,
    organizationId: string | null,
    token: string,
    expiresAt: Date,
    createdAt: Date = new Date(),
    lastActiveAt: Date = new Date()
  ) {
    super(new StringId(id));
    this.userId = userId;
    this.organizationId = organizationId;
    this.token = token;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.lastActiveAt = lastActiveAt;

    this.validateState();
  }

  /**
   * Kiểm tra tính hợp lệ của trạng thái entity.
   */
  private validateState(): void {
    if (!this.userId) {
      throw new Error('User ID không được để trống');
    }

    if (!this.token) {
      throw new Error('Token không được để trống');
    }

    if (!this.expiresAt) {
      throw new Error('Thời điểm hết hạn không được để trống');
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
   * Lấy token xác thực.
   */
  get getToken(): string {
    return this.token;
  }

  /**
   * Lấy thời điểm hết hạn.
   */
  get getExpiresAt(): Date {
    return this.expiresAt;
  }

  /**
   * Lấy thời điểm tạo.
   */
  get getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Lấy thời điểm hoạt động cuối cùng.
   */
  get getLastActiveAt(): Date {
    return this.lastActiveAt;
  }

  /**
   * Kiểm tra xem phiên làm việc đã hết hạn chưa.
   */
  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Cập nhật thời điểm hoạt động cuối cùng thành thời điểm hiện tại.
   */
  public updateLastActiveAt(): void {
    this.lastActiveAt = new Date();
  }

  /**
   * Kết thúc phiên làm việc bằng cách đặt thời gian hết hạn thành hiện tại.
   */
  public terminate(): void {
    this.expiresAt = new Date();
  }

  /**
   * Gia hạn phiên làm việc thêm một khoảng thời gian.
   *
   * @param durationInHours - Số giờ cần gia hạn
   */
  public extend(durationInHours: number): void {
    if (durationInHours <= 0) {
      throw new Error('Thời gian gia hạn phải lớn hơn 0');
    }

    if (this.isExpired()) {
      throw new Error('Không thể gia hạn phiên làm việc đã hết hạn');
    }

    const newExpiresAt = new Date(this.expiresAt);
    newExpiresAt.setHours(newExpiresAt.getHours() + durationInHours);
    this.expiresAt = newExpiresAt;
  }

  /**
   * Lấy giá trị ID dưới dạng chuỗi.
   */
  get idValue(): string {
    return this.id.value;
  }
}
