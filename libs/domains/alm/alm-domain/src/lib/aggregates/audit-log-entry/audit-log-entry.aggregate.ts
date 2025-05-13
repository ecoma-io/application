import { AbstractAggregate, UuidId } from "@ecoma/common-domain";
import { Maybe } from "@ecoma/common-types";
import { v4 as uuidv4 } from "uuid";
import { AuditLogEntryImmutableError } from "../../errors/audit-log/audit-log-entry-immutable.error";
import { InvalidAuditLogEntryError } from "../../errors/audit-log/invalid-audit-log-entry.error";
import { AuditContext } from "../../value-objects/audit-context/audit-context.vo";
import {
  AuditLogCategory,
  AuditLogSeverity,
  AuditLogStatus,
} from "../../value-objects/audit-log-query-criteria/audit-log-query-criteria.vo";
import { Initiator } from "../../value-objects/initiator/initiator.vo";

/**
 * Props của AuditLogEntry aggregate
 */
export interface IAuditLogEntryProps {
  /** ID của sự kiện gốc (tuỳ chọn) */
  eventId?: Maybe<string>;
  /** Thời điểm hành động xảy ra */
  timestamp: Date;
  /** Người hoặc hệ thống đã thực hiện hành động */
  initiator: Initiator;
  /** Tên Bounded Context nguồn */
  boundedContext: string;
  /** Loại hành động */
  actionType: string;
  /** Danh mục (tuỳ chọn) */
  category?: Maybe<AuditLogCategory>;
  /** Mức độ nghiêm trọng (tuỳ chọn) */
  severity?: Maybe<AuditLogSeverity>;
  /** ID thực thể bị ảnh hưởng (tuỳ chọn) */
  entityId?: Maybe<string>;
  /** Loại thực thể bị ảnh hưởng (tuỳ chọn) */
  entityType?: Maybe<string>;
  /** ID của tổ chức (tuỳ chọn) */
  tenantId?: Maybe<string>;
  /** Dữ liệu ngữ cảnh bổ sung */
  contextData: AuditContext;
  /** Trạng thái của hành động */
  status: AuditLogStatus;
  /** Lý do thất bại (tuỳ chọn, chỉ có khi status là Failure) */
  failureReason?: Maybe<string>;
  /** Thời điểm bản ghi log được tạo */
  createdAt: Date;
}

/**
 * Aggregate Root đại diện cho một bản ghi kiểm tra (audit log) trong hệ thống.
 * AuditLogEntry là bất biến - một khi được tạo, không thể thay đổi.
 */
export class AuditLogEntry extends AbstractAggregate<UuidId> {
  /** ID của sự kiện gốc (tuỳ chọn) */
  private readonly $eventId?: Maybe<string>;
  /** Thời điểm hành động xảy ra */
  private readonly $timestamp: Date;
  /** Người hoặc hệ thống đã thực hiện hành động */
  private readonly $initiator: Initiator;
  /** Tên Bounded Context nguồn */
  private readonly $boundedContext: string;
  /** Loại hành động */
  private readonly $actionType: string;
  /** Danh mục (tuỳ chọn) */
  private readonly $category?: Maybe<AuditLogCategory>;
  /** Mức độ nghiêm trọng (tuỳ chọn) */
  private readonly $severity?: Maybe<AuditLogSeverity>;
  /** ID thực thể bị ảnh hưởng (tuỳ chọn) */
  private readonly $entityId?: Maybe<string>;
  /** Loại thực thể bị ảnh hưởng (tuỳ chọn) */
  private readonly $entityType?: Maybe<string>;
  /** ID của tổ chức (tuỳ chọn) */
  private readonly $tenantId?: Maybe<string>;
  /** Dữ liệu ngữ cảnh bổ sung */
  private readonly $contextData: AuditContext;
  /** Trạng thái của hành động */
  private readonly $status: AuditLogStatus;
  /** Lý do thất bại (tuỳ chọn, chỉ có khi status là Failure) */
  private readonly $failureReason?: Maybe<string>;
  /** Thời điểm bản ghi log được tạo */
  private readonly $createdAt: Date;

  /**
   * Tạo mới một AuditLogEntry
   *
   * @param id - ID của bản ghi
   * @param props - Các thuộc tính của bản ghi
   */
  private constructor(id: UuidId, props: IAuditLogEntryProps) {
    super(id);
    this.$eventId = props.eventId;
    this.$timestamp = props.timestamp;
    this.$initiator = props.initiator;
    this.$boundedContext = props.boundedContext;
    this.$actionType = props.actionType;
    this.$category = props.category;
    this.$severity = props.severity;
    this.$entityId = props.entityId;
    this.$entityType = props.entityType;
    this.$tenantId = props.tenantId;
    this.$contextData = props.contextData;
    this.$status = props.status;
    this.$failureReason = props.failureReason;
    this.$createdAt = props.createdAt;

    // Đóng băng đối tượng để đảm bảo tính bất biến
    Object.freeze(this);
  }

  /**
   * Factory method để tạo một AuditLogEntry mới
   *
   * @param eventId - ID của sự kiện gốc (tuỳ chọn)
   * @param timestamp - Thời điểm hành động xảy ra
   * @param initiator - Người hoặc hệ thống đã thực hiện hành động
   * @param boundedContext - Tên Bounded Context nguồn
   * @param actionType - Loại hành động
   * @param contextData - Dữ liệu ngữ cảnh bổ sung
   * @param status - Trạng thái của hành động
   * @param options - Các thuộc tính tuỳ chọn khác
   * @returns Instance mới của AuditLogEntry
   * @throws {InvalidAuditLogEntryError} nếu dữ liệu không hợp lệ
   */
  public static create(
    eventId: Maybe<string>,
    timestamp: Date,
    initiator: Initiator,
    boundedContext: string,
    actionType: string,
    contextData: AuditContext,
    status: AuditLogStatus,
    options?: {
      category?: Maybe<AuditLogCategory>;
      severity?: Maybe<AuditLogSeverity>;
      entityId?: Maybe<string>;
      entityType?: Maybe<string>;
      tenantId?: Maybe<string>;
      failureReason?: Maybe<string>;
    }
  ): AuditLogEntry {
    // Validate đầu vào bắt buộc
    if (
      !timestamp ||
      !(timestamp instanceof Date) ||
      isNaN(timestamp.getTime())
    ) {
      throw new InvalidAuditLogEntryError(
        "Timestamp is required and must be a valid date"
      );
    }

    if (!initiator || !(initiator instanceof Initiator)) {
      throw new InvalidAuditLogEntryError(
        "Initiator is required and must be an Initiator instance"
      );
    }

    if (!boundedContext || boundedContext.trim() === "") {
      throw new InvalidAuditLogEntryError(
        "BoundedContext is required and cannot be empty"
      );
    }

    if (!actionType || actionType.trim() === "") {
      throw new InvalidAuditLogEntryError(
        "ActionType is required and cannot be empty"
      );
    }

    if (!contextData || !(contextData instanceof AuditContext)) {
      throw new InvalidAuditLogEntryError(
        "ContextData is required and must be an AuditContext instance"
      );
    }

    if (!Object.values(AuditLogStatus).includes(status)) {
      throw new InvalidAuditLogEntryError(`Invalid status: ${status}`);
    }

    // Validate failureReason khi status là Failure
    if (
      status === AuditLogStatus.Failure &&
      (!options?.failureReason || options.failureReason.trim() === "")
    ) {
      throw new InvalidAuditLogEntryError(
        "FailureReason is required when status is Failure"
      );
    }

    // Validate category nếu có
    if (
      options?.category !== undefined &&
      options.category !== null &&
      !Object.values(AuditLogCategory).includes(options.category)
    ) {
      throw new InvalidAuditLogEntryError(
        `Invalid category: ${options.category}`
      );
    }

    // Validate severity nếu có
    if (
      options?.severity !== undefined &&
      options.severity !== null &&
      !Object.values(AuditLogSeverity).includes(options.severity)
    ) {
      throw new InvalidAuditLogEntryError(
        `Invalid severity: ${options.severity}`
      );
    }

    // Validate entityId và entityType phải cùng có hoặc cùng không
    if (
      (options?.entityId && !options?.entityType) ||
      (!options?.entityId && options?.entityType)
    ) {
      throw new InvalidAuditLogEntryError(
        "EntityId and EntityType must be both provided or both empty"
      );
    }

    // Tạo UUID mới cho bản ghi
    const id = new UuidId(uuidv4());

    return new AuditLogEntry(id, {
      eventId,
      timestamp,
      initiator,
      boundedContext: boundedContext.trim(),
      actionType: actionType.trim(),
      category: options?.category,
      severity: options?.severity,
      entityId: options?.entityId?.trim(),
      entityType: options?.entityType?.trim(),
      tenantId: options?.tenantId?.trim(),
      contextData,
      status,
      failureReason: options?.failureReason?.trim(),
      createdAt: new Date(), // Sử dụng thời gian hiện tại
    });
  }

  /**
   * Factory method để tái tạo một AuditLogEntry từ dữ liệu đã lưu trữ
   *
   * @param id - ID của bản ghi
   * @param eventId - ID của sự kiện gốc (tuỳ chọn)
   * @param timestamp - Thời điểm hành động xảy ra
   * @param initiator - Người hoặc hệ thống đã thực hiện hành động
   * @param boundedContext - Tên Bounded Context nguồn
   * @param actionType - Loại hành động
   * @param contextData - Dữ liệu ngữ cảnh bổ sung
   * @param status - Trạng thái của hành động
   * @param createdAt - Thời điểm bản ghi log được tạo
   * @param options - Các thuộc tính tuỳ chọn khác
   * @returns Instance tái tạo của AuditLogEntry
   * @throws {InvalidAuditLogEntryError} nếu dữ liệu không hợp lệ
   */
  public static reconstitute(
    id: string,
    eventId: Maybe<string>,
    timestamp: Date,
    initiator: Initiator,
    boundedContext: string,
    actionType: string,
    contextData: AuditContext,
    status: AuditLogStatus,
    createdAt: Date,
    options?: {
      category?: Maybe<AuditLogCategory>;
      severity?: Maybe<AuditLogSeverity>;
      entityId?: Maybe<string>;
      entityType?: Maybe<string>;
      tenantId?: Maybe<string>;
      failureReason?: Maybe<string>;
    }
  ): AuditLogEntry {
    // Validate đầu vào
    if (!id || id.trim() === "") {
      throw new InvalidAuditLogEntryError("ID is required for reconstitution");
    }

    if (
      !timestamp ||
      !(timestamp instanceof Date) ||
      isNaN(timestamp.getTime())
    ) {
      throw new InvalidAuditLogEntryError(
        "Timestamp is required and must be a valid date"
      );
    }

    if (
      !createdAt ||
      !(createdAt instanceof Date) ||
      isNaN(createdAt.getTime())
    ) {
      throw new InvalidAuditLogEntryError(
        "CreatedAt is required and must be a valid date"
      );
    }

    if (!initiator || !(initiator instanceof Initiator)) {
      throw new InvalidAuditLogEntryError(
        "Initiator is required and must be an Initiator instance"
      );
    }

    if (!boundedContext || boundedContext.trim() === "") {
      throw new InvalidAuditLogEntryError(
        "BoundedContext is required and cannot be empty"
      );
    }

    if (!actionType || actionType.trim() === "") {
      throw new InvalidAuditLogEntryError(
        "ActionType is required and cannot be empty"
      );
    }

    if (!contextData || !(contextData instanceof AuditContext)) {
      throw new InvalidAuditLogEntryError(
        "ContextData is required and must be an AuditContext instance"
      );
    }

    if (!Object.values(AuditLogStatus).includes(status)) {
      throw new InvalidAuditLogEntryError(`Invalid status: ${status}`);
    }

    try {
      const uuidId = new UuidId(id);

      return new AuditLogEntry(uuidId, {
        eventId,
        timestamp,
        initiator,
        boundedContext: boundedContext.trim(),
        actionType: actionType.trim(),
        category: options?.category,
        severity: options?.severity,
        entityId: options?.entityId?.trim(),
        entityType: options?.entityType?.trim(),
        tenantId: options?.tenantId?.trim(),
        contextData,
        status,
        failureReason: options?.failureReason?.trim(),
        createdAt,
      });
    } catch (error) {
      throw new InvalidAuditLogEntryError(
        `Failed to reconstitute AuditLogEntry: ${(error as Error).message}`
      );
    }
  }

  /**
   * Lấy ID của bản ghi dưới dạng chuỗi
   */
  get stringId(): string {
    return this.id.value;
  }

  /**
   * Lấy ID của sự kiện gốc
   */
  get eventId(): Maybe<string> {
    return this.$eventId;
  }

  /**
   * Lấy thời điểm hành động xảy ra
   */
  get timestamp(): Date {
    return new Date(this.$timestamp);
  }

  /**
   * Lấy thông tin về người hoặc hệ thống đã thực hiện hành động
   */
  get initiator(): Initiator {
    return this.$initiator;
  }

  /**
   * Lấy tên Bounded Context nguồn
   */
  get boundedContext(): string {
    return this.$boundedContext;
  }

  /**
   * Lấy loại hành động
   */
  get actionType(): string {
    return this.$actionType;
  }

  /**
   * Lấy danh mục
   */
  get category(): Maybe<AuditLogCategory> {
    return this.$category;
  }

  /**
   * Lấy mức độ nghiêm trọng
   */
  get severity(): Maybe<AuditLogSeverity> {
    return this.$severity;
  }

  /**
   * Lấy ID thực thể bị ảnh hưởng
   */
  get entityId(): Maybe<string> {
    return this.$entityId;
  }

  /**
   * Lấy loại thực thể bị ảnh hưởng
   */
  get entityType(): Maybe<string> {
    return this.$entityType;
  }

  /**
   * Lấy ID của tổ chức
   */
  get tenantId(): Maybe<string> {
    return this.$tenantId;
  }

  /**
   * Lấy dữ liệu ngữ cảnh bổ sung
   */
  get contextData(): AuditContext {
    return this.$contextData;
  }

  /**
   * Lấy trạng thái của hành động
   */
  get status(): AuditLogStatus {
    return this.$status;
  }

  /**
   * Lấy lý do thất bại
   */
  get failureReason(): Maybe<string> {
    return this.$failureReason;
  }

  /**
   * Lấy thời điểm bản ghi log được tạo
   */
  get createdAt(): Date {
    return new Date(this.$createdAt);
  }

  /**
   * KHÔNG CHO PHÉP CẬP NHẬT - bản ghi audit log là bất biến
   * @throws {AuditLogEntryImmutableError} luôn luôn ném lỗi
   */
  public update(): never {
    throw new AuditLogEntryImmutableError("Cannot update audit log entry");
  }

  /**
   * KHÔNG CHO PHÉP XÓA - bản ghi audit log là bất biến
   * @throws {AuditLogEntryImmutableError} luôn luôn ném lỗi
   */
  public delete(): never {
    throw new AuditLogEntryImmutableError("Cannot delete audit log entry");
  }
}
