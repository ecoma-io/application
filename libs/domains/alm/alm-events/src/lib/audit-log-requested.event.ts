/**
 * Sự kiện này được phát ra bởi các Bounded Context khác khi cần ghi nhận một hành động vào audit log.
 * ALM lắng nghe sự kiện này để tạo mới một bản ghi AuditLogEntry.
 */
export class AuditLogRequestedEvent {

  /**
   * Tên của exchange được sử dụng để phát sự kiện.
   */
  public static readonly exchange = 'alm.events';

  /**
   * Khóa định tuyến được sử dụng để phát sự kiện.
   */
  public static readonly routingKey = 'audit.log';


  /** Thời điểm hành động xảy ra ở BC nguồn */
  readonly timestamp: Date;
  /** Thông tin về người hoặc hệ thống thực hiện hành động */
  readonly initiator: {
    type: string;
    id?: string;
    name: string;
  };
  /** Tên định danh của BC nguồn */
  readonly boundedContext: string;
  /** Loại hành động, ví dụ: "User.Created", "Order.Updated" */
  readonly actionType: string;
  /** Danh mục log (tùy chọn) */
  readonly category?: string;
  /** Mức độ nghiêm trọng (tùy chọn) */
  readonly severity?: string;
  /** ID thực thể bị ảnh hưởng (tùy chọn) */
  readonly entityId?: string;
  /** Loại thực thể bị ảnh hưởng (tùy chọn) */
  readonly entityType?: string;
  /** ID tổ chức liên quan (tùy chọn) */
  readonly tenantId?: string;
  /** Dữ liệu ngữ cảnh chi tiết (tùy chọn) */
  readonly contextData?: Record<string, unknown>;
  /** Trạng thái hành động: "Success" hoặc "Failure" */
  readonly status: string;
  /** Lý do thất bại nếu status là "Failure" (tùy chọn) */
  readonly failureReason?: string;
  /** ID của event nghiệp vụ gốc nếu có (tùy chọn) */
  readonly eventId?: string;
  /** Thời điểm event được phát ra bởi BC nguồn */
  readonly issuedAt: Date;

  /**
   * Khởi tạo sự kiện AuditLogRequestedEvent
   * @param props Thông tin chi tiết của event
   */
  constructor(props: {
    timestamp: Date;
    initiator: { type: string; id?: string; name: string };
    boundedContext: string;
    actionType: string;
    category?: string;
    severity?: string;
    entityId?: string;
    entityType?: string;
    tenantId?: string;
    contextData?: Record<string, unknown>;
    status: string;
    failureReason?: string;
    eventId?: string;
    issuedAt: Date;
  }) {
    this.timestamp = props.timestamp;
    this.initiator = props.initiator;
    this.boundedContext = props.boundedContext;
    this.actionType = props.actionType;
    this.category = props.category;
    this.severity = props.severity;
    this.entityId = props.entityId;
    this.entityType = props.entityType;
    this.tenantId = props.tenantId;
    this.contextData = props.contextData;
    this.status = props.status;
    this.failureReason = props.failureReason;
    this.eventId = props.eventId;
    this.issuedAt = props.issuedAt;
  }
}
