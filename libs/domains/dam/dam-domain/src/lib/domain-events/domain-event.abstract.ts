/**
 * Lớp cơ sở trừu tượng cho tất cả các Domain Events trong DAM Bounded Context.
 */
export abstract class DomainEvent {
  /**
   * Mã định danh duy nhất của event.
   */
  public readonly eventId: string;

  /**
   * Thời điểm phát sinh event.
   */
  public readonly occurredAt: Date;

  /**
   * Phiên bản của event schema.
   */
  public readonly version: string = '1.0';

  /**
   * Loại event.
   */
  public abstract readonly eventType: string;

  /**
   * Khởi tạo một domain event.
   *
   * @param eventId - ID của event, sẽ được tạo tự động nếu không cung cấp
   * @param occurredAt - Thời điểm phát sinh event, mặc định là thời điểm hiện tại
   */
  constructor(eventId?: string, occurredAt?: Date) {
    this.eventId = eventId || this._generateUuid();
    this.occurredAt = occurredAt || new Date();
  }

  /**
   * Tạo một UUID v4.
   *
   * @returns UUID v4 string
   * @private
   */
  private _generateUuid(): string {
    // Cài đặt tạm thời, trong thực tế nên sử dụng thư viện chuyên dụng như uuid
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
