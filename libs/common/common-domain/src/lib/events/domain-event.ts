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
export interface IDomainEvent {
  /**
   * ID duy nhất của event, được tạo tự động nếu không được cung cấp.
   * Sử dụng UUID v7 để đảm bảo tính duy nhất và có thể sắp xếp theo thời gian.
   */
  id: string;

  /**
   * Thời điểm event xảy ra, mặc định là thời điểm tạo event.
   */
  timestamp: Date;

  /**
   * Định danh tương quan (Correlation ID).
   * Dùng để liên kết các sự kiện và hành động thuộc cùng một luồng xử lý ban đầu (request).
   *
   * @example
   * ```typescript
   * const metadata: IDomainEventMetadata = {
   *   correlationId: "123e4567-e89b-12d3-a456-426614174000"
   * };
   * ```
   */
  correlationId?: string;

  /**
   * Định danh nguyên nhân (Causation ID).
   * ID của sự kiện hoặc lệnh (Command) đã trực tiếp gây ra sự kiện này.
   *
   * @example
   * ```typescript
   * const metadata: IDomainEventMetadata = {
   *   causationId: "123e4567-e89b-12d3-a456-426614174001"
   * };
   * ```
   */
  causationId?: string;

  /**
   * ID của người dùng đã khởi tạo hành động dẫn đến sự kiện.
   * Được sử dụng cho audit logging và truy vết.
   *
   * @example
   * ```typescript
   * const metadata: IDomainEventMetadata = {
   *   userId: "user-123"
   * };
   * ```
   */
  userId?: string;

  /**
   * Địa chỉ IP liên quan đến hành động.
   * Được sử dụng cho audit logging và bảo mật.
   *
   * @example
   * ```typescript
   * const metadata: IDomainEventMetadata = {
   *   ipAddress: "192.168.1.1"
   * };
   * ```
   */
  ipAddress?: string;

  /**
   * User agent của client liên quan đến hành động.
   * Được sử dụng cho audit logging và phân tích.
   *
   * @example
   * ```typescript
   * const metadata: IDomainEventMetadata = {
   *   userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
   * };
   * ```
   */
  userAgent?: string;

  /**
   * Ngôn ngữ liên quan đến ngữ cảnh người dùng/request.
   * Tuân theo chuẩn BCP 47 language tag.
   *
   * @example
   * ```typescript
   * const metadata: IDomainEventMetadata = {
   *   language: "vi-VN"
   * };
   * ```
   */
  language?: string;

  /**
   * Phiên bản của Aggregate Root sau khi sự kiện này xảy ra.
   * Được sử dụng cho optimistic concurrency control và event sourcing.
   *
   * @example
   * ```typescript
   * const metadata: IDomainEventMetadata = {
   *   aggregateVersion: 1
   * };
   * ```
   */
  aggregateVersion?: number;

  /**
   * Tên của Bounded Context nguồn đã phát ra sự kiện.
   * Chỉ bắt buộc cho Integration Events giữa các BC.
   *
   * @example
   * ```typescript
   * const metadata: IDomainEventMetadata = {
   *   sourceBoundedContext: "OrderManagement"
   * };
   * ```
   */
  sourceBoundedContext?: string;
}
