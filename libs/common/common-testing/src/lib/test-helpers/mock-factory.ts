/* eslint-disable @typescript-eslint/no-unused-vars */
import { jest } from "@jest/globals";
import type { MethodLikeKeys, SpyInstance } from "jest-mock";

export class MockFactory {
  /**
   * Tạo một mock function với implementation mặc định
   */
  static createMockFn<T extends (...args: unknown[]) => unknown>(
    implementation?: T
  ): ReturnType<typeof jest.fn> {
    return jest.fn(implementation);
  }

  /**
   * Tạo một mock object với các methods được mock
   */
  static createMockObject<T extends object>(
    methods: Partial<Record<keyof T, ReturnType<typeof jest.fn>>>
  ): T {
    return methods as T;
  }

  /**
   * Tạo một spy trên một method của object
   */
  static createSpy<T extends object, TKey extends MethodLikeKeys<T>>(
    object: T,
    method: TKey
  ): SpyInstance {
    return jest.spyOn(object, method);
  }

  /**
   * Tạo một mock implementation cho một class
   */
  static createMockClass<T extends new (...args: unknown[]) => unknown>(
    implementation: Partial<InstanceType<T>>
  ): ReturnType<typeof jest.fn> {
    return jest.fn().mockImplementation(() => implementation);
  }

  /**
   * Reset tất cả các mocks
   */
  static resetAllMocks(): void {
    jest.resetAllMocks();
  }

  /**
   * Clear tất cả các mocks
   */
  static clearAllMocks(): void {
    jest.clearAllMocks();
  }
}

/**
 * Mock client cho NATS dùng cho unit test.
 * @since 1.1.0
 */
export class MockNatsClient {
  /**
   * Gửi request giả lập
   */
  request(subject: string, data: unknown): Promise<unknown> {
    return Promise.resolve({ subject, data, mock: true });
  }
  /**
   * Đăng ký handler giả lập
   */
  subscribe(subject: string, handler: (data: unknown) => void): void {
    // Không làm gì
  }
}

/**
 * Mock client cho RabbitMQ dùng cho unit test.
 * @since 1.1.0
 */
export class MockRabbitMQClient {
  /**
   * Gửi message giả lập
   */
  publish(queue: string, message: unknown): Promise<boolean> {
    return Promise.resolve(true);
  }
  /**
   * Đăng ký consumer giả lập
   */
  consume(queue: string, handler: (msg: unknown) => void): void {
    // Không làm gì
  }
}
