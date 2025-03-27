import { TestDataFactory } from "./test-data-factory";

export class TestUtils {
  /**
   * Tạo một array với số lượng elements cho trước
   */
  static createArray<T>(length: number, factory: (index: number) => T): T[] {
    return Array.from({ length }, (_, index) => factory(index));
  }

  /**
   * Tạo một object với các properties ngẫu nhiên
   */
  static createRandomObject<T extends object>(
    template: T,
    overrides?: Partial<T>
  ): T {
    const result = { ...template };
    Object.keys(template).forEach((key) => {
      const value = template[key as keyof T];
      if (typeof value === "string") {
        result[key as keyof T] = TestDataFactory.createString(10) as T[keyof T];
      } else if (typeof value === "number") {
        result[key as keyof T] = TestDataFactory.createNumber(
          0,
          100
        ) as T[keyof T];
      } else if (value instanceof Date) {
        result[key as keyof T] = TestDataFactory.createDate(
          new Date(2000, 0, 1),
          new Date()
        ) as T[keyof T];
      }
    });
    return { ...result, ...overrides };
  }

  /**
   * Tạo một deep copy của object
   */
  static deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Tạo một delay với thời gian cho trước
   */
  static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Tạo một retry function
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number,
    delayMs: number
  ): Promise<T> {
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxAttempts) {
          await this.delay(delayMs);
        }
      }
    }
    throw lastError ?? new Error("Unknown error");
  }

  /**
   * Tạo một timeout promise
   */
  static timeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    });
  }
}
