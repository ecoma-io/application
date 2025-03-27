import { expect } from "@jest/globals";

/**
 * Helper hỗ trợ snapshot testing.
 * @since 1.1.0
 */
export class SnapshotHelper {
  /**
   * So sánh một đối tượng với snapshot đã lưu
   * @param value - Giá trị cần so sánh với snapshot
   * @param snapshotName - Tên snapshot (tùy chọn)
   */
  static toMatchSnapshot<T>(value: T, snapshotName?: string): void {
    if (snapshotName) {
      expect(value).toMatchSnapshot(snapshotName);
    } else {
      expect(value).toMatchSnapshot();
    }
  }

  /**
   * So sánh một đối tượng với snapshot inline
   * @param value - Giá trị cần so sánh với snapshot
   * @param snapshot - Snapshot inline
   */
  static toMatchInlineSnapshot<T>(value: T, snapshot: string): void {
    expect(value).toMatchInlineSnapshot(snapshot);
  }

  /**
   * Chuẩn hóa đối tượng trước khi so sánh với snapshot
   * Loại bỏ các trường không ổn định như timestamp, id ngẫu nhiên, v.v.
   * @param obj - Đối tượng cần chuẩn hóa
   * @param fieldsToExclude - Các trường cần loại bỏ
   * @returns Đối tượng đã được chuẩn hóa
   */
  static normalizeForSnapshot<T extends Record<string, unknown>>(
    obj: T,
    fieldsToExclude: string[] = ["id", "createdAt", "updatedAt", "timestamp"]
  ): Partial<T> {
    const result = { ...obj } as Partial<T>;

    fieldsToExclude.forEach((field) => {
      if (field in result) {
        delete result[field as keyof T];
      }
    });

    // Xử lý các đối tượng lồng nhau
    Object.entries(result).forEach(([key, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        (result as any)[key] = this.normalizeForSnapshot(
          value as Record<string, unknown>,
          fieldsToExclude
        );
      } else if (Array.isArray(value)) {
        (result as any)[key] = value.map((item) =>
          item && typeof item === "object"
            ? this.normalizeForSnapshot(
                item as Record<string, unknown>,
                fieldsToExclude
              )
            : item
        );
      }
    });

    return result;
  }

  /**
   * So sánh một đối tượng đã được chuẩn hóa với snapshot
   * @param value - Giá trị cần so sánh với snapshot
   * @param fieldsToExclude - Các trường cần loại bỏ trước khi so sánh
   * @param snapshotName - Tên snapshot (tùy chọn)
   */
  static toMatchNormalizedSnapshot<T extends Record<string, unknown>>(
    value: T,
    fieldsToExclude: string[] = ["id", "createdAt", "updatedAt", "timestamp"],
    snapshotName?: string
  ): void {
    const normalized = this.normalizeForSnapshot(value, fieldsToExclude);
    this.toMatchSnapshot(normalized, snapshotName);
  }
}
