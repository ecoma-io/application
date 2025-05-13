import { AbstractValueObject } from "@ecoma/common-domain";
import { Maybe } from "@ecoma/common-types";
import { InvalidRetentionRuleError } from "../../errors/audit-log/invalid-retention-rule.error";

/**
 * Props của RetentionRule value object
 */
export interface IRetentionRuleProps {
  /** Áp dụng cho BC cụ thể (tuỳ chọn) */
  boundedContext?: Maybe<string>;
  /** Áp dụng cho loại hành động cụ thể (tuỳ chọn) */
  actionType?: Maybe<string>;
  /** Áp dụng cho loại thực thể cụ thể (tuỳ chọn) */
  entityType?: Maybe<string>;
  /** Áp dụng cho Tenant cụ thể (tuỳ chọn) */
  tenantId?: Maybe<string>;
  /** Thời gian lưu trữ (số ngày) */
  retentionDuration: number;
}

/**
 * Value Object đại diện cho một quy tắc cụ thể trong chính sách retention.
 * Mỗi RetentionRule xác định một bộ tiêu chí và thời gian lưu trữ tương ứng.
 */
export class RetentionRule extends AbstractValueObject<IRetentionRuleProps> {
  /** Số ngày lưu trữ tối thiểu (1 ngày) */
  private static readonly MIN_RETENTION_DAYS = 1;
  /** Số ngày lưu trữ tối đa (10 năm = 3650 ngày) */
  private static readonly MAX_RETENTION_DAYS = 3650;

  /**
   * Tạo mới một RetentionRule
   * @param props - Các thuộc tính của RetentionRule
   */
  private constructor(props: IRetentionRuleProps) {
    super(props);
  }

  /**
   * Factory method để tạo một RetentionRule
   *
   * @param retentionDuration - Thời gian lưu trữ (số ngày)
   * @param boundedContext - Áp dụng cho BC cụ thể (tuỳ chọn)
   * @param actionType - Áp dụng cho loại hành động cụ thể (tuỳ chọn)
   * @param entityType - Áp dụng cho loại thực thể cụ thể (tuỳ chọn)
   * @param tenantId - Áp dụng cho Tenant cụ thể (tuỳ chọn)
   * @returns Instance mới của RetentionRule
   * @throws {InvalidRetentionRuleError} nếu dữ liệu không hợp lệ
   */
  public static create(
    retentionDuration: number,
    boundedContext?: Maybe<string>,
    actionType?: Maybe<string>,
    entityType?: Maybe<string>,
    tenantId?: Maybe<string>
  ): RetentionRule {
    // Validate thời gian lưu trữ
    if (
      !Number.isInteger(retentionDuration) ||
      retentionDuration < RetentionRule.MIN_RETENTION_DAYS ||
      retentionDuration > RetentionRule.MAX_RETENTION_DAYS
    ) {
      throw new InvalidRetentionRuleError(
        `Retention duration must be an integer between ${RetentionRule.MIN_RETENTION_DAYS} and ${RetentionRule.MAX_RETENTION_DAYS} days`
      );
    }

    // Kiểm tra xem có ít nhất một tiêu chí cụ thể được cung cấp
    if (!boundedContext && !actionType && !entityType && !tenantId) {
      throw new InvalidRetentionRuleError(
        "At least one criteria (boundedContext, actionType, entityType, or tenantId) must be specified"
      );
    }

    return new RetentionRule({
      boundedContext,
      actionType,
      entityType,
      tenantId,
      retentionDuration,
    });
  }

  /**
   * Lấy tên Bounded Context
   */
  get boundedContext(): Maybe<string> {
    return this.props.boundedContext;
  }

  /**
   * Lấy loại hành động
   */
  get actionType(): Maybe<string> {
    return this.props.actionType;
  }

  /**
   * Lấy loại thực thể
   */
  get entityType(): Maybe<string> {
    return this.props.entityType;
  }

  /**
   * Lấy ID của tổ chức
   */
  get tenantId(): Maybe<string> {
    return this.props.tenantId;
  }

  /**
   * Lấy thời gian lưu trữ (số ngày)
   */
  get retentionDuration(): number {
    return this.props.retentionDuration;
  }

  /**
   * Kiểm tra xem quy tắc có áp dụng cho bản ghi kiểm tra nào đó không
   *
   * @param auditLogBoundedContext - Tên Bounded Context của bản ghi
   * @param auditLogActionType - Loại hành động của bản ghi
   * @param auditLogEntityType - Loại thực thể của bản ghi
   * @param auditLogTenantId - ID tổ chức của bản ghi
   * @returns true nếu quy tắc áp dụng cho bản ghi, ngược lại là false
   */
  public appliesTo(
    auditLogBoundedContext: string,
    auditLogActionType?: Maybe<string>,
    auditLogEntityType?: Maybe<string>,
    auditLogTenantId?: Maybe<string>
  ): boolean {
    // Kiểm tra từng tiêu chí nếu có
    if (
      this.props.boundedContext &&
      this.props.boundedContext !== auditLogBoundedContext
    ) {
      return false;
    }

    if (
      this.props.actionType &&
      auditLogActionType &&
      this.props.actionType !== auditLogActionType
    ) {
      return false;
    }

    if (
      this.props.entityType &&
      auditLogEntityType &&
      this.props.entityType !== auditLogEntityType
    ) {
      return false;
    }

    if (
      this.props.tenantId &&
      auditLogTenantId &&
      this.props.tenantId !== auditLogTenantId
    ) {
      return false;
    }

    return true;
  }

  /**
   * Tính toán ngày hết hạn dựa trên ngày tạo và thời gian lưu trữ
   *
   * @param createdAt - Ngày tạo bản ghi
   * @returns Ngày hết hạn
   */
  public calculateExpirationDate(createdAt: Date): Date {
    const expirationDate = new Date(createdAt);
    expirationDate.setDate(expirationDate.getDate() + this.retentionDuration);
    return expirationDate;
  }
}
