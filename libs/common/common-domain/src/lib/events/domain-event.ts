// src/shared/domain/abstracts/abstract-domain-event.ts

import { v7 as uuidv7 } from "uuid";
import { IDomainEventMetadata } from "./domain-event-metadata";

/**
 * Lớp cơ sở trừu tượng cho tất cả các Domain Event trong Domain Driven Design.
 *
 * Domain Event đại diện cho một sự kiện quan trọng đã xảy ra trong Domain.
 * Mỗi event có một ID duy nhất, timestamp và metadata.
 *
 * @example
 * ```typescript
 * class OrderCreatedEvent extends AbstractDomainEvent {
 *   public readonly orderId: string;
 *   public readonly customerId: string;
 *
 *   constructor(orderId: string, customerId: string) {
 *     super();
 *     this.orderId = orderId;
 *     this.customerId = customerId;
 *   }
 * }
 * ```
 */
export abstract class AbstractDomainEvent {
  /**
   * ID duy nhất của event, được tạo tự động nếu không được cung cấp.
   * Sử dụng UUID v7 để đảm bảo tính duy nhất và có thể sắp xếp theo thời gian.
   */
  public readonly id: string;

  /**
   * Thời điểm event xảy ra, mặc định là thời điểm tạo event.
   */
  public readonly timestamp: Date;

  /**
   * Metadata của event, chứa các thông tin bổ sung như correlationId, causationId, etc.
   */
  public readonly metadata: IDomainEventMetadata;

  /**
   * Tạo một instance mới của Domain Event.
   *
   * @param timestamp - Thời điểm event xảy ra, mặc định là thời điểm hiện tại
   * @param metadata - Metadata của event, mặc định là object rỗng
   * @param id - ID của event, mặc định sẽ được tạo tự động
   *
   * @example
   * ```typescript
   * // Tạo event với timestamp và metadata tùy chỉnh
   * const event = new OrderCreatedEvent(
   *   'order-123',
   *   'customer-456',
   *   new Date('2024-01-01'),
   *   { correlationId: 'corr-789' }
   * );
   *
   * // Tạo event với các giá trị mặc định
   * const event = new OrderCreatedEvent('order-123', 'customer-456');
   * ```
   */
  constructor(timestamp?: Date, metadata?: IDomainEventMetadata, id?: string) {
    this.id = id ?? uuidv7();
    this.timestamp = timestamp ?? new Date();
    this.metadata = Object.freeze({ ...metadata });
  }
}
