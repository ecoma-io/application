import { AbstractAggregate } from '@ecoma/common-domain';
import { InvitationStatus } from '../value-objects/invitation-status.enum';
import { StringId } from '../value-objects/string-id.value-object';

/**
 * Aggregate Root đại diện cho một lời mời người dùng tham gia vào một tổ chức khách hàng.
 * 
 * @since 1.0.0
 */
export class Invitation extends AbstractAggregate<StringId> {
  /**
   * ID của tổ chức gửi lời mời.
   */
  private organizationId: string;

  /**
   * Email của người được mời.
   */
  private inviteeEmail: string;

  /**
   * ID của người gửi lời mời.
   */
  private inviterUserId: string;

  /**
   * ID của vai trò được gán khi chấp nhận lời mời.
   */
  private roleId: string;

  /**
   * Trạng thái lời mời.
   */
  private status: InvitationStatus;

  /**
   * Token duy nhất để xác nhận lời mời.
   */
  private token: string;

  /**
   * Thời điểm hết hạn của lời mời.
   */
  private expiresAt: Date;

  /**
   * Thời điểm tạo lời mời.
   */
  private createdAt: Date;

  /**
   * Khởi tạo một instance mới của Invitation.
   * 
   * @param id - ID duy nhất của lời mời
   * @param organizationId - ID của tổ chức gửi lời mời
   * @param inviteeEmail - Email của người được mời
   * @param inviterUserId - ID của người gửi lời mời
   * @param roleId - ID của vai trò được gán khi chấp nhận lời mời
   * @param token - Token duy nhất để xác nhận lời mời
   * @param expiresAt - Thời điểm hết hạn của lời mời
   * @param status - Trạng thái lời mời
   * @param createdAt - Thời điểm tạo lời mời
   */
  constructor(
    id: string,
    organizationId: string,
    inviteeEmail: string,
    inviterUserId: string,
    roleId: string,
    token: string,
    expiresAt: Date,
    status: InvitationStatus = InvitationStatus.PENDING,
    createdAt: Date = new Date()
  ) {
    super(new StringId(id));
    this.organizationId = organizationId;
    this.inviteeEmail = inviteeEmail;
    this.inviterUserId = inviterUserId;
    this.roleId = roleId;
    this.token = token;
    this.expiresAt = expiresAt;
    this.status = status;
    this.createdAt = createdAt;

    this.validateState();
  }

  /**
   * Lấy giá trị ID dưới dạng chuỗi.
   */
  get idValue(): string {
    return this.id.value;
  }

  /**
   * Lấy ID của tổ chức gửi lời mời.
   */
  get getOrganizationId(): string {
    return this.organizationId;
  }

  /**
   * Lấy email của người được mời.
   */
  get getInviteeEmail(): string {
    return this.inviteeEmail;
  }

  /**
   * Lấy ID của người gửi lời mời.
   */
  get getInviterUserId(): string {
    return this.inviterUserId;
  }

  /**
   * Lấy ID của vai trò được gán khi chấp nhận lời mời.
   */
  get getRoleId(): string {
    return this.roleId;
  }

  /**
   * Lấy trạng thái lời mời.
   */
  get getStatus(): InvitationStatus {
    return this.status;
  }

  /**
   * Lấy token xác nhận lời mời.
   */
  get getToken(): string {
    return this.token;
  }

  /**
   * Lấy thời điểm hết hạn của lời mời.
   */
  get getExpiresAt(): Date {
    return new Date(this.expiresAt);
  }

  /**
   * Lấy thời điểm tạo lời mời.
   */
  get getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  /**
   * Kiểm tra xem lời mời đã hết hạn hay chưa.
   * 
   * @returns true nếu lời mời đã hết hạn, ngược lại false
   */
  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Chấp nhận lời mời.
   * 
   * @throws Error - Nếu lời mời không ở trạng thái Pending hoặc đã hết hạn
   */
  public accept(): void {
    if (this.status !== InvitationStatus.PENDING) {
      throw new Error('Chỉ có thể chấp nhận lời mời đang ở trạng thái Pending');
    }

    if (this.isExpired()) {
      throw new Error('Không thể chấp nhận lời mời đã hết hạn');
    }

    this.status = InvitationStatus.ACCEPTED;
  }

  /**
   * Từ chối lời mời.
   * 
   * @throws Error - Nếu lời mời không ở trạng thái Pending hoặc đã hết hạn
   */
  public decline(): void {
    if (this.status !== InvitationStatus.PENDING) {
      throw new Error('Chỉ có thể từ chối lời mời đang ở trạng thái Pending');
    }

    if (this.isExpired()) {
      throw new Error('Không thể từ chối lời mời đã hết hạn');
    }

    this.status = InvitationStatus.DECLINED;
  }

  /**
   * Đánh dấu lời mời đã hết hạn.
   * 
   * @throws Error - Nếu lời mời không ở trạng thái Pending
   */
  public expire(): void {
    if (this.status !== InvitationStatus.PENDING) {
      throw new Error('Chỉ có thể đánh dấu hết hạn cho lời mời đang ở trạng thái Pending');
    }

    this.status = InvitationStatus.EXPIRED;
  }

  /**
   * Gửi lại lời mời.
   * 
   * @param newToken - Token mới cho lời mời
   * @param newExpiresAt - Thời điểm hết hạn mới
   * @throws Error - Nếu lời mời không ở trạng thái Pending hoặc Expired
   */
  public resend(newToken: string, newExpiresAt: Date): void {
    if (this.status !== InvitationStatus.PENDING && this.status !== InvitationStatus.EXPIRED) {
      throw new Error('Chỉ có thể gửi lại lời mời đang ở trạng thái Pending hoặc Expired');
    }

    this.token = newToken;
    this.expiresAt = newExpiresAt;
    this.status = InvitationStatus.PENDING;
  }

  /**
   * Thu hồi lời mời.
   * 
   * @throws Error - Nếu lời mời không ở trạng thái Pending hoặc Expired
   */
  public revoke(): void {
    if (this.status !== InvitationStatus.PENDING && this.status !== InvitationStatus.EXPIRED) {
      throw new Error('Chỉ có thể thu hồi lời mời đang ở trạng thái Pending hoặc Expired');
    }

    this.status = InvitationStatus.REVOKED;
  }

  /**
   * Kiểm tra tính hợp lệ của trạng thái.
   * 
   * @throws Error - Nếu trạng thái không hợp lệ
   */
  private validateState(): void {
    if (!this.organizationId) {
      throw new Error('ID tổ chức không được để trống');
    }

    if (!this.inviteeEmail) {
      throw new Error('Email người được mời không được để trống');
    }

    if (!this.inviterUserId) {
      throw new Error('ID người gửi lời mời không được để trống');
    }

    if (!this.roleId) {
      throw new Error('ID vai trò không được để trống');
    }

    if (!this.token) {
      throw new Error('Token xác nhận không được để trống');
    }

    if (!this.expiresAt) {
      throw new Error('Thời điểm hết hạn không được để trống');
    }
  }
} 