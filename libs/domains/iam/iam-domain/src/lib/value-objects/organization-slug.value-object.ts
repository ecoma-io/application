import { AbstractValueObject } from '@ecoma/common-domain';

/**
 * Đại diện cho slug của tổ chức.
 */
export class OrganizationSlug extends AbstractValueObject<{ value: string }> {
  /**
   * Tạo một đối tượng OrganizationSlug mới.
   * @param value - Giá trị slug
   * @throws Error khi định dạng slug không hợp lệ
   */
  constructor(value: string) {
    super({ value });
    this.validate(value);
  }

  /**
   * Chuyển đổi giá trị slug thành chuỗi
   * @returns String representation of the slug
   */
  public override toString(): string {
    return this.props.value;
  }

  /**
   * Kiểm tra tính hợp lệ của slug.
   * @param slug - Chuỗi slug cần kiểm tra
   * @throws Error khi định dạng slug không hợp lệ
   */
  private validate(slug: string): void {
    // Chỉ chấp nhận chữ thường, số, dấu gạch ngang
    const slugRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

    if (!slugRegex.test(slug)) {
      throw new Error('Slug không hợp lệ. Chỉ được chứa chữ thường, số, dấu gạch ngang. Không được bắt đầu/kết thúc bằng dấu gạch ngang.');
    }

    // Kiểm tra độ dài tối thiểu
    if (slug.length < 3) {
      throw new Error('Slug phải có ít nhất 3 ký tự');
    }

    // Kiểm tra độ dài tối đa
    if (slug.length > 63) {
      throw new Error('Slug không được vượt quá 63 ký tự');
    }
  }
}
