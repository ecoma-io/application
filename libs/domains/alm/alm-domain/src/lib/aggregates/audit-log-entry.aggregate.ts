import { AbstractAggregate, DomainValidationError } from "@ecoma/common-domain";
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
  entityId?: string;
  entityType?: string;
  tenantId?: string;
  contextData?: AuditContext;
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
      !props.initiator
    ) {
      throw new DomainValidationError(
        "Missing required fields for audit log entry: timestamp, boundedContext, actionType, status, and initiator must be provided"
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
}
