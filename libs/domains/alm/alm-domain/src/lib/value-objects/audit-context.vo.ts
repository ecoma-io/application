import { AbstractValueObject } from '@ecoma/common-domain';

/**
 * Interface thuộc tính của AuditContext
 */
export interface IAuditContextProps {
  [key: string]: unknown;
}

/**
 * Value Object đại diện cho ngữ cảnh của hành động được ghi log
 * Là một đối tượng động có thể chứa các thông tin tùy chỉnh
 */
export class AuditContext extends AbstractValueObject<IAuditContextProps> {
  /**
   * Khởi tạo đối tượng AuditContext
   * @param props Thuộc tính của context
   */
  constructor(props: IAuditContextProps) {
    super(props);
    Object.freeze(this);
  }

  /**
   * Lấy giá trị của một key trong context
   * @param key Tên key
   */
  get(key: string): unknown {
    return this.props[key];
  }

  /**
   * Kiểm tra có tồn tại key trong context không
   * @param key Tên key
   */
  has(key: string): boolean {
    return key in this.props;
  }

  /**
   * Lấy tất cả thuộc tính của context
   */
  getAll(): Record<string, unknown> {
    return { ...this.props };
  }
}
