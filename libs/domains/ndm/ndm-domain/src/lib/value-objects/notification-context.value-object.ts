import { AbstractValueObject } from '@ecoma/common-domain';

/**
 * Đại diện cho dữ liệu ngữ cảnh để render template thông báo.
 * Chứa các cặp key-value cần thiết để điền vào template.
 */
export class NotificationContext extends AbstractValueObject<{ value: Record<string, unknown> }> {
  private constructor(value: Record<string, unknown>) {
    super({ value });
  }

  /**
   * Tạo một đối tượng NotificationContext mới
   * @param contextData Dữ liệu ngữ cảnh dưới dạng key-value
   * @returns Đối tượng NotificationContext
   */
  public static create(contextData: Record<string, unknown>): NotificationContext {
    if (!contextData || typeof contextData !== 'object') {
      throw new Error('Context data must be a non-null object');
    }

    return new NotificationContext(contextData);
  }

  /**
   * Kiểm tra xem context có chứa key cụ thể không
   * @param key Key cần kiểm tra
   * @returns true nếu key tồn tại trong context
   */
  public hasKey(key: string): boolean {
    return key in this.props.value;
  }

  /**
   * Lấy giá trị của một key trong context
   * @param key Key cần lấy giá trị
   * @returns Giá trị của key hoặc undefined nếu không tồn tại
   */
  public getValue(key: string): unknown {
    return this.props.value[key];
  }

  /**
   * Kiểm tra xem context có chứa tất cả các key bắt buộc không
   * @param requiredKeys Danh sách các key bắt buộc
   * @returns true nếu tất cả key bắt buộc đều tồn tại
   */
  public hasRequiredKeys(requiredKeys: string[]): boolean {
    return requiredKeys.every(key => this.hasKey(key));
  }

  /**
   * Lấy danh sách các key thiếu từ danh sách key bắt buộc
   * @param requiredKeys Danh sách các key bắt buộc
   * @returns Danh sách các key bắt buộc bị thiếu
   */
  public getMissingRequiredKeys(requiredKeys: string[]): string[] {
    return requiredKeys.filter(key => !this.hasKey(key));
  }

  /**
   * Lấy tất cả dữ liệu context
   * @returns Dữ liệu context dưới dạng object
   */
  public getData(): Record<string, unknown> {
    return { ...this.props.value };
  }
}
