import { AbstractValueObject } from '@ecoma/common-domain';

/**
 * Đại diện cho thông tin hồ sơ cơ bản của người dùng.
 */
export class UserProfile extends AbstractValueObject<{
  firstName: string;
  lastName: string;
  locale: string;
}> {
  /**
   * Họ của người dùng.
   */
  public readonly firstName: string;

  /**
   * Tên của người dùng.
   */
  public readonly lastName: string;

  /**
   * Mã locale/ngôn ngữ ưa thích của người dùng.
   */
  public readonly locale: string;

  /**
   * Tạo một đối tượng UserProfile mới.
   * @param firstName - Họ của người dùng
   * @param lastName - Tên của người dùng
   * @param locale - Mã locale/ngôn ngữ ưa thích
   * @throws Error khi dữ liệu không hợp lệ
   */
  constructor(firstName: string, lastName: string, locale: string) {
    super({
      firstName,
      lastName,
      locale
    });

    this.firstName = firstName;
    this.lastName = lastName;
    this.locale = locale;

    this.validate();
  }

  /**
   * Kiểm tra tính hợp lệ của thông tin hồ sơ.
   * @throws Error khi dữ liệu không hợp lệ
   */
  private validate(): void {
    if (!this.firstName || this.firstName.trim() === '') {
      throw new Error('Họ không được để trống');
    }

    if (!this.lastName || this.lastName.trim() === '') {
      throw new Error('Tên không được để trống');
    }

    // Kiểm tra locale hợp lệ (có thể mở rộng với danh sách các locale hợp lệ từ RDM)
    if (!this.locale || !/^[a-z]{2}-[A-Z]{2}$/.test(this.locale)) {
      throw new Error('Mã locale không hợp lệ. Định dạng yêu cầu: xx-XX');
    }
  }

  /**
   * Lấy tên đầy đủ của người dùng.
   * @returns Tên đầy đủ (Họ + Tên)
   */
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
