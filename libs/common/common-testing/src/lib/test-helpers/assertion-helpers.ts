import { expect } from "@jest/globals";

export class AssertionHelpers {
  /**
   * Kiểm tra xem một object có chứa tất cả các properties của object khác không
   */
  static expectToContainAllProperties<T extends object>(
    actual: T,
    expected: Partial<T>
  ): void {
    Object.entries(expected).forEach(([key, value]) => {
      expect(actual).toHaveProperty(key, value);
    });
  }

  /**
   * Kiểm tra xem một array có chứa tất cả các elements của array khác không
   */
  static expectArrayToContainAll<T>(actual: T[], expected: T[]): void {
    expected.forEach((item) => {
      expect(actual).toContainEqual(item);
    });
  }

  /**
   * Kiểm tra xem một date có nằm trong khoảng thời gian cho trước không
   */
  static expectDateToBeBetween(actual: Date, start: Date, end: Date): void {
    expect(actual.getTime()).toBeGreaterThanOrEqual(start.getTime());
    expect(actual.getTime()).toBeLessThanOrEqual(end.getTime());
  }

  /**
   * Kiểm tra xem một string có match với regex pattern không
   */
  static expectStringToMatch(actual: string, pattern: RegExp): void {
    expect(actual).toMatch(pattern);
  }

  /**
   * Kiểm tra xem một object có đúng type không
   */
  static expectToBeInstanceOf<T>(
    actual: unknown,
    expectedType: new (...args: unknown[]) => T
  ): void {
    expect(actual).toBeInstanceOf(expectedType);
  }

  /**
   * Kiểm tra xem một function có throw error với message cho trước không
   */
  static expectToThrowWithMessage(
    fn: () => void,
    expectedMessage: string | RegExp
  ): void {
    expect(fn).toThrow(expectedMessage);
  }
}
