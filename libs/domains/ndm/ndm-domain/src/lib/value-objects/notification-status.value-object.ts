import { AbstractValueObject } from '@ecoma/common-domain';

/**
 * Valid notification status values
 */
type ValidStatus = 'Pending' | 'Sending' | 'Sent' | 'Failed' | 'Delivered' | 'Read' | 'Retrying';

/**
 * Đại diện cho trạng thái của một thông báo.
 * Các trạng thái có thể: Pending, Sending, Sent, Failed, Delivered, Read, Retrying
 */
export class NotificationStatus extends AbstractValueObject<{ value: string }> {
  private static readonly VALID_STATUSES: readonly ValidStatus[] = [
    'Pending',    // Đang chờ gửi
    'Sending',    // Đang trong quá trình gửi
    'Sent',       // Đã gửi thành công
    'Failed',     // Gửi thất bại
    'Delivered',  // Đã được gửi đến người nhận
    'Read',       // Đã được đọc
    'Retrying'    // Đang chờ thử lại
  ];

  private constructor(value: string) {
    super({ value });
  }

  /**
   * Tạo một đối tượng NotificationStatus mới
   * @param value Giá trị trạng thái
   * @returns Đối tượng NotificationStatus
   * @throws Error nếu giá trị không hợp lệ
   */
  public static create(value: string): NotificationStatus {
    const normalizedValue = value.trim();

    // Check if the normalized value is one of the valid statuses
    if (!this.isValidStatus(normalizedValue)) {
      throw new Error(`Invalid status: ${value}. Valid values are: ${this.VALID_STATUSES.join(', ')}`);
    }

    return new NotificationStatus(normalizedValue);
  }

  /**
   * Check if a status string is valid
   * @param status The status string to check
   * @returns boolean indicating if the status is valid
   */
  private static isValidStatus(status: string): boolean {
    return this.VALID_STATUSES.includes(status as ValidStatus);
  }

  /**
   * Tạo trạng thái Pending
   */
  public static createPending(): NotificationStatus {
    return new NotificationStatus('Pending');
  }

  /**
   * Tạo trạng thái Sending
   */
  public static createSending(): NotificationStatus {
    return new NotificationStatus('Sending');
  }

  /**
   * Tạo trạng thái Sent
   */
  public static createSent(): NotificationStatus {
    return new NotificationStatus('Sent');
  }

  /**
   * Tạo trạng thái Failed
   */
  public static createFailed(): NotificationStatus {
    return new NotificationStatus('Failed');
  }

  /**
   * Tạo trạng thái Delivered
   */
  public static createDelivered(): NotificationStatus {
    return new NotificationStatus('Delivered');
  }

  /**
   * Tạo trạng thái Read
   */
  public static createRead(): NotificationStatus {
    return new NotificationStatus('Read');
  }

  /**
   * Tạo trạng thái Retrying
   */
  public static createRetrying(): NotificationStatus {
    return new NotificationStatus('Retrying');
  }

  /**
   * Kiểm tra có phải là trạng thái Pending
   */
  public isPending(): boolean {
    return this.props.value === 'Pending';
  }

  /**
   * Kiểm tra có phải là trạng thái Sending
   */
  public isSending(): boolean {
    return this.props.value === 'Sending';
  }

  /**
   * Kiểm tra có phải là trạng thái Sent
   */
  public isSent(): boolean {
    return this.props.value === 'Sent';
  }

  /**
   * Kiểm tra có phải là trạng thái Failed
   */
  public isFailed(): boolean {
    return this.props.value === 'Failed';
  }

  /**
   * Kiểm tra có phải là trạng thái Delivered
   */
  public isDelivered(): boolean {
    return this.props.value === 'Delivered';
  }

  /**
   * Kiểm tra có phải là trạng thái Read
   */
  public isRead(): boolean {
    return this.props.value === 'Read';
  }

  /**
   * Kiểm tra có phải là trạng thái Retrying
   */
  public isRetrying(): boolean {
    return this.props.value === 'Retrying';
  }

  /**
   * Kiểm tra có phải là trạng thái cuối cùng (không thể thay đổi nữa)
   */
  public isFinal(): boolean {
    return this.isRead() || this.isFailed();
  }

  /**
   * Chuyển đổi thành chuỗi
   */
  public override toString(): string {
    return this.props.value;
  }
}
