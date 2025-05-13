import { AbstractValueObject } from "@ecoma/common-domain";
import { InvalidAuditContextError } from "../../errors/audit-log/invalid-audit-context.error";

/**
 * Props của AuditContext value object
 */
export interface IAuditContextProps {
  /** Giá trị ngữ cảnh (có thể chứa các thông tin như IP, user agent, thay đổi dữ liệu, ...) */
  value: Record<string, unknown>;
}

/**
 * Value Object đại diện cho dữ liệu ngữ cảnh bổ sung liên quan đến hành động
 * được ghi nhận trong bản ghi kiểm tra (audit log). Dữ liệu này có thể chứa
 * thông tin về các thay đổi dữ liệu, thông tin môi trường, và các thông tin
 * khác giúp hiểu rõ hơn về hành động.
 */
export class AuditContext extends AbstractValueObject<IAuditContextProps> {
  /**
   * Tạo mới một AuditContext
   * @param props - Các thuộc tính của AuditContext
   */
  private constructor(props: IAuditContextProps) {
    super(props);
  }

  /**
   * Factory method để tạo một AuditContext
   *
   * @param value - Giá trị ngữ cảnh dạng object (có thể chứa các thông tin như IP,
   *                user agent, thay đổi dữ liệu, v.v.)
   * @returns Instance mới của AuditContext
   * @throws {InvalidAuditContextError} nếu dữ liệu không hợp lệ
   */
  public static create(value: Record<string, unknown>): AuditContext {
    // Validate đầu vào
    if (!value || typeof value !== "object") {
      throw new InvalidAuditContextError("Context value must be an object");
    }

    try {
      // Kiểm tra xem object có thể serialize thành JSON được không
      JSON.stringify(value);
    } catch (error) {
      throw new InvalidAuditContextError(
        "Context value contains non-serializable data",
        { error: (error as Error).message }
      );
    }

    return new AuditContext({ value });
  }

  /**
   * Lấy giá trị ngữ cảnh
   */
  get value(): Record<string, unknown> {
    return this.props.value;
  }

  /**
   * Lấy một thuộc tính cụ thể từ ngữ cảnh
   *
   * @param key - Tên thuộc tính cần lấy
   * @returns Giá trị của thuộc tính hoặc undefined nếu không tồn tại
   */
  public getProperty(key: string): unknown {
    return this.props.value[key];
  }

  /**
   * Kiểm tra xem ngữ cảnh có chứa một thuộc tính cụ thể không
   *
   * @param key - Tên thuộc tính cần kiểm tra
   * @returns true nếu thuộc tính tồn tại, ngược lại là false
   */
  public hasProperty(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.props.value, key);
  }
}
