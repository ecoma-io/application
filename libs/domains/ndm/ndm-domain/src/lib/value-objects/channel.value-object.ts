import { AbstractValueObject } from '@ecoma/common-domain';

/**
 * Đại diện cho một kênh gửi thông báo.
 * Chấp nhận các giá trị: Email, SMS, InApp, Push
 */
export class Channel extends AbstractValueObject<{ value: string }> {
  private static readonly VALID_CHANNELS = ['Email', 'SMS', 'InApp', 'Push'];

  private constructor(value: string) {
    super({ value });
  }

  /**
   * Tạo một đối tượng Channel mới
   * @param value Giá trị kênh (Email, SMS, InApp, Push)
   * @returns Đối tượng Channel
   * @throws Error nếu giá trị không hợp lệ
   */
  public static create(value: string): Channel {
    const normalizedValue = value.trim();

    if (!this.VALID_CHANNELS.includes(normalizedValue)) {
      throw new Error(`Invalid channel: ${value}. Valid values are: ${this.VALID_CHANNELS.join(', ')}`);
    }

    return new Channel(normalizedValue);
  }

  /**
   * Tạo một đối tượng Channel Email
   * @returns Đối tượng Channel Email
   */
  public static createEmail(): Channel {
    return new Channel('Email');
  }

  /**
   * Tạo một đối tượng Channel SMS
   * @returns Đối tượng Channel SMS
   */
  public static createSMS(): Channel {
    return new Channel('SMS');
  }

  /**
   * Tạo một đối tượng Channel InApp
   * @returns Đối tượng Channel InApp
   */
  public static createInApp(): Channel {
    return new Channel('InApp');
  }

  /**
   * Tạo một đối tượng Channel Push
   * @returns Đối tượng Channel Push
   */
  public static createPush(): Channel {
    return new Channel('Push');
  }

  /**
   * Kiểm tra có phải là kênh Email
   * @returns true nếu là kênh Email
   */
  public isEmail(): boolean {
    return this.props.value === 'Email';
  }

  /**
   * Kiểm tra có phải là kênh SMS
   * @returns true nếu là kênh SMS
   */
  public isSMS(): boolean {
    return this.props.value === 'SMS';
  }

  /**
   * Kiểm tra có phải là kênh InApp
   * @returns true nếu là kênh InApp
   */
  public isInApp(): boolean {
    return this.props.value === 'InApp';
  }

  /**
   * Kiểm tra có phải là kênh Push
   * @returns true nếu là kênh Push
   */
  public isPush(): boolean {
    return this.props.value === 'Push';
  }

  /**
   * Chuyển đổi thành chuỗi
   * @returns Giá trị dưới dạng chuỗi
   */
  public override toString(): string {
    return this.props.value;
  }
}
