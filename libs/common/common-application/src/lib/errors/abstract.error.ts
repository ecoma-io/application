/**
 * @fileoverview Lớp cơ sở cho tất cả các lỗi trong application layer
 * @since 1.0.0
 */

export abstract class AbstractApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
