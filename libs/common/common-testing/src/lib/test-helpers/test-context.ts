/**
 * Interface mô tả một test context có thể quản lý vòng đời (lifecycle) của test.
 * @since 1.1.0
 */
export interface ITestContext {
  /**
   * Thiết lập môi trường test trước khi chạy test
   */
  setup(): Promise<void>;

  /**
   * Dọn dẹp môi trường test sau khi chạy test
   */
  teardown(): Promise<void>;
}

/**
 * Class cơ sở cho các test context, hỗ trợ quản lý môi trường test.
 * @since 1.1.0
 */
export abstract class AbstractTestContext implements ITestContext {
  /**
   * Thiết lập môi trường test trước khi chạy test
   */
  abstract setup(): Promise<void>;

  /**
   * Dọn dẹp môi trường test sau khi chạy test
   */
  abstract teardown(): Promise<void>;

  /**
   * Chạy một hàm trong ngữ cảnh của test context này
   * @param fn - Hàm cần chạy trong ngữ cảnh test
   * @returns Kết quả của hàm
   */
  async run<T>(fn: () => Promise<T>): Promise<T> {
    try {
      await this.setup();
      const result = await fn();
      return result;
    } finally {
      await this.teardown();
    }
  }
}

/**
 * Context quản lý nhiều test context con, hỗ trợ nested context.
 * @since 1.1.0
 */
export class CompositeTestContext extends AbstractTestContext {
  private contexts: ITestContext[] = [];

  /**
   * Thêm một test context con
   * @param context - Test context cần thêm
   */
  addContext(context: ITestContext): void {
    this.contexts.push(context);
  }

  /**
   * Thiết lập tất cả các test context con theo thứ tự thêm vào
   */
  async setup(): Promise<void> {
    for (const context of this.contexts) {
      await context.setup();
    }
  }

  /**
   * Dọn dẹp tất cả các test context con theo thứ tự ngược lại
   */
  async teardown(): Promise<void> {
    for (const context of [...this.contexts].reverse()) {
      await context.teardown();
    }
  }
}

/**
 * Context quản lý các container test (MongoDB, PostgreSQL, RabbitMQ, v.v.)
 * @since 1.1.0
 */
export class ContainerTestContext extends AbstractTestContext {
  private containers: {
    start: () => Promise<unknown>;
    stop: () => Promise<void>;
  }[] = [];
  private startedContainers: unknown[] = [];

  /**
   * Thêm một container vào context
   * @param container - Container cần quản lý
   */
  addContainer<T>(container: {
    start: () => Promise<T>;
    stop: () => Promise<void>;
  }): void {
    this.containers.push(container);
  }

  /**
   * Khởi động tất cả các container đã thêm
   */
  async setup(): Promise<void> {
    this.startedContainers = [];
    for (const container of this.containers) {
      const started = await container.start();
      this.startedContainers.push(started);
    }
  }

  /**
   * Dừng tất cả các container đã khởi động
   */
  async teardown(): Promise<void> {
    for (const container of this.containers) {
      await container.stop();
    }
    this.startedContainers = [];
  }

  /**
   * Lấy container đã khởi động theo index
   * @param index - Vị trí của container trong danh sách
   * @returns Container đã khởi động
   */
  getStartedContainer<T>(index: number): T {
    return this.startedContainers[index] as T;
  }
}
