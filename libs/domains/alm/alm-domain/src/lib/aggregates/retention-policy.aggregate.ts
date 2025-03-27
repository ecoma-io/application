import { AbstractAggregate, DomainValidationError } from "@ecoma/common-domain";
import { RetentionPolicyId } from "../value-objects";

/**
 * Thuộc tính của Retention Policy
 */
export interface IRetentionPolicyProps {
  id: RetentionPolicyId;
  name: string;
  description?: string;
  boundedContext?: string;
  actionType?: string;
  entityType?: string;
  tenantId?: string;
  retentionDays: number; // Số ngày lưu trữ, bắt buộc, integer > 0
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Aggregate root cho chính sách lưu trữ (Retention Policy)
 */
export class RetentionPolicy extends AbstractAggregate<
  RetentionPolicyId,
  IRetentionPolicyProps
> {
  /**
   * Khởi tạo một retention policy mới
   * @param props Thuộc tính của policy
   */
  constructor(props: IRetentionPolicyProps) {
    super(props);

    // Kiểm tra invariants
    if (!props.name || props.name.trim().length === 0) {
      throw new DomainValidationError("Policy name must not be empty");
    }
    if (
      !props.retentionDays ||
      props.retentionDays <= 0 ||
      !Number.isInteger(props.retentionDays)
    ) {
      throw new DomainValidationError(
        "Retention days must be a positive integer"
      );
    }
  }

  /**
   * Cập nhật thông tin retention policy
   * @param name Tên mới
   * @param description Mô tả mới
   * @param boundedContext BC mới (optional)
   * @param actionType ActionType mới (optional)
   * @param entityType EntityType mới (optional)
   * @param tenantId TenantId mới (optional)
   * @param retentionDays retentionDays mới (bắt buộc)
   */
  update(
    name: string,
    description: string | undefined,
    boundedContext: string | undefined,
    actionType: string | undefined,
    entityType: string | undefined,
    tenantId: string | undefined,
    retentionDays: number
  ): void {
    // Kiểm tra invariants
    if (!name || name.trim().length === 0) {
      throw new DomainValidationError("Policy name must not be empty");
    }
    if (
      !retentionDays ||
      retentionDays <= 0 ||
      !Number.isInteger(retentionDays)
    ) {
      throw new DomainValidationError(
        "Retention days must be a positive integer"
      );
    }
    // Cập nhật thông tin
    this.props.name = name;
    this.props.description = description;
    this.props.boundedContext = boundedContext;
    this.props.actionType = actionType;
    this.props.entityType = entityType;
    this.props.tenantId = tenantId;
    this.props.retentionDays = retentionDays;
    this.props.updatedAt = new Date();
  }

  /**
   * Kích hoạt retention policy
   */
  activate(): void {
    if (this.props.isActive) {
      return; // Đã kích hoạt rồi, không cần làm gì thêm
    }
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  /**
   * Vô hiệu hóa retention policy
   */
  deactivate(): void {
    if (!this.props.isActive) {
      return; // Đã vô hiệu hóa rồi, không cần làm gì thêm
    }
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get boundedContext(): string | undefined {
    return this.props.boundedContext;
  }

  get actionType(): string | undefined {
    return this.props.actionType;
  }

  get entityType(): string | undefined {
    return this.props.entityType;
  }

  get tenantId(): string | undefined {
    return this.props.tenantId;
  }

  get retentionDays(): number {
    return this.props.retentionDays;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
