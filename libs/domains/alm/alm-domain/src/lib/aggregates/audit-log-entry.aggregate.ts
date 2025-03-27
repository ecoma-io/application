import { AbstractAggregate } from "@ecoma/common-domain";

import { Severity, Status } from "../constants";
import { InvalidAuditLogEntryError } from "../errors";
import { AuditContext, Initiator } from "../value-objects";
import { AuditLogEntryId } from "../value-objects/audit-log-entry-id.vo";

/**
 * Định nghĩa các thuộc tính của một bản ghi Audit Log.
 */
export interface IAuditLogEntryProps {
  id: AuditLogEntryId;
  timestamp: Date;
  initiator: Initiator;
  boundedContext: string;
  actionType: string;
  category?: string;
  severity?: Severity;
  entityId?: string;
  entityType?: string;
  tenantId?: string;
  contextData?: AuditContext;
  status: Status;
  errorMessage?: string;
  processedAt?: Date;
  createdAt: Date;
}

/**
 * Aggregate root cho bản ghi Audit Log.
 */
export class AuditLogEntry extends AbstractAggregate<
  AuditLogEntryId,
  IAuditLogEntryProps
> {
  /**
   * Khởi tạo một bản ghi Audit Log mới.
   * @param props Các thuộc tính của bản ghi.
   */
  constructor(props: IAuditLogEntryProps) {
    super(props);

    // Kiểm tra các thuộc tính bắt buộc
    if (
      !props.timestamp ||
      !props.boundedContext ||
      !props.actionType ||
      !props.status ||
      !props.initiator
    ) {
      throw new InvalidAuditLogEntryError(
        "Missing required fields for audit log entry: timestamp, boundedContext, actionType, status, and initiator must be provided"
      );
    }
  }

  /**
   * Đánh dấu bản ghi đã được xử lý thành công.
   */
  markAsProcessed(): void {
    this.ensurePendingStatus(this.props.status);
    this.props.status = Status.Success;
    this.props.processedAt = new Date();
  }

  /**
   * Đánh dấu bản ghi xử lý thất bại.
   * @param errorMessage Thông báo lỗi.
   */
  markAsFailed(errorMessage: string): void {
    this.ensurePendingStatus(this.props.status);
    this.props.status = Status.Failure;
    this.props.errorMessage = errorMessage;
    this.props.processedAt = new Date();
  }

  /**
   * Đảm bảo trạng thái của bản ghi là Pending.
   *
   * @param {Status} status Trạng thái hiện tại của bản ghi.
   * @throws {InvalidAuditLogEntryError} Nếu trạng thái không phải là Pending.
   */
  private ensurePendingStatus(status: Status): void {
    if (status !== Status.Pending) {
      throw new InvalidAuditLogEntryError(
        "Cannot process audit log entry: entry must be in Pending status for processing",
        undefined,
        { status }
      );
    }
  }

  /**
   * Lấy thời điểm xảy ra sự kiện.
   */
  public get timestamp(): Date {
    return this.props.timestamp;
  }

  /**
   * Lấy bounded context của bản ghi.
   */
  public get boundedContext(): string {
    return this.props.boundedContext;
  }

  /**
   * Lấy loại hành động của bản ghi.
   */
  public get actionType(): string {
    return this.props.actionType;
  }

  /**
   * Lấy danh mục của bản ghi.
   */
  public get category(): string | undefined {
    return this.props.category;
  }

  /**
   * Lấy mức độ nghiêm trọng của bản ghi.
   */
  public get severity(): Severity | undefined {
    return this.props.severity;
  }

  /**
   * Lấy ID của thực thể liên quan.
   */
  public get entityId(): string | undefined {
    return this.props.entityId;
  }

  /**
   * Lấy loại thực thể liên quan.
   */
  public get entityType(): string | undefined {
    return this.props.entityType;
  }

  /**
   * Lấy ID của tenant.
   */
  public get tenantId(): string | undefined {
    return this.props.tenantId;
  }

  /**
   * Lấy trạng thái của bản ghi.
   */
  public get status(): Status {
    return this.props.status;
  }

  /**
   * Lấy thông tin người/hệ thống thực hiện hành động.
   */
  public get initiator(): Initiator {
    return this.props.initiator;
  }

  /**
   * Lấy dữ liệu ngữ cảnh của bản ghi.
   */
  public get contextData(): AuditContext | undefined {
    return this.props.contextData;
  }

  /**
   * Lấy thông báo lỗi nếu có.
   */
  public get errorMessage(): string | undefined {
    return this.props.errorMessage;
  }

  /**
   * Lấy thời điểm bản ghi được xử lý.
   */
  public get processedAt(): Date | undefined {
    return this.props.processedAt;
  }

  /**
   * Lấy thời điểm bản ghi được tạo.
   */
  public get createdAt(): Date {
    return this.props.createdAt;
  }
}
