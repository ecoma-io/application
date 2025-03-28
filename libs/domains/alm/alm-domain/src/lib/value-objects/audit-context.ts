/**
 * @fileoverview Value object định nghĩa context của audit log
 * @since 1.0.0
 */

/**
 * Value object định nghĩa context của audit log
 */
export class AuditContext {
  private constructor(
    /** Bounded context của hành động */
    private readonly boundedContextValue: string,
    /** ID của tenant */
    private readonly tenantIdValue: string,
    /** ID của người dùng thực hiện hành động */
    private readonly userIdValue: string,
    /** Loại hành động */
    private readonly actionTypeValue: string,
    /** Loại entity */
    private readonly entityTypeValue: string,
    /** ID của entity */
    private readonly entityIdValue: string,
    /** Thời gian thực hiện */
    private readonly timestampValue: Date,
    /** Thông tin bổ sung */
    private readonly metadataValue?: Record<string, unknown>
  ) {}

  /**
   * Tạo một instance mới của AuditContext
   * @param {Object} params - Các tham số để tạo AuditContext
   * @param {string} params.boundedContext - Bounded context của hành động
   * @param {string} params.tenantId - ID của tenant
   * @param {string} params.userId - ID của người dùng thực hiện hành động
   * @param {string} params.actionType - Loại hành động
   * @param {string} params.entityType - Loại entity
   * @param {string} params.entityId - ID của entity
   * @param {Date} params.timestamp - Thời gian thực hiện
   * @param {Record<string, unknown>} [params.metadata] - Thông tin bổ sung
   * @returns {AuditContext} Instance mới của AuditContext
   */
  static create(params: {
    boundedContext: string;
    tenantId: string;
    userId: string;
    actionType: string;
    entityType: string;
    entityId: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
  }): AuditContext {
    return new AuditContext(
      params.boundedContext,
      params.tenantId,
      params.userId,
      params.actionType,
      params.entityType,
      params.entityId,
      params.timestamp,
      params.metadata
    );
  }

  /**
   * Lấy toàn bộ giá trị của audit context
   * @returns {Object} Toàn bộ giá trị của audit context
   */
  get value(): {
    boundedContext: string;
    tenantId: string;
    userId: string;
    actionType: string;
    entityType: string;
    entityId: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
  } {
    return {
      boundedContext: this.boundedContextValue,
      tenantId: this.tenantIdValue,
      userId: this.userIdValue,
      actionType: this.actionTypeValue,
      entityType: this.entityTypeValue,
      entityId: this.entityIdValue,
      timestamp: this.timestampValue,
      metadata: this.metadataValue,
    };
  }

  /**
   * Lấy bounded context
   * @returns {string} Bounded context
   */
  get boundedContext(): string {
    return this.boundedContextValue;
  }

  /**
   * Lấy tenant ID
   * @returns {string} Tenant ID
   */
  get tenantId(): string {
    return this.tenantIdValue;
  }

  /**
   * Lấy user ID
   * @returns {string} User ID
   */
  get userId(): string {
    return this.userIdValue;
  }

  /**
   * Lấy loại hành động
   * @returns {string} Loại hành động
   */
  get actionType(): string {
    return this.actionTypeValue;
  }

  /**
   * Lấy loại entity
   * @returns {string} Loại entity
   */
  get entityType(): string {
    return this.entityTypeValue;
  }

  /**
   * Lấy ID của entity
   * @returns {string} ID của entity
   */
  get entityId(): string {
    return this.entityIdValue;
  }

  /**
   * Lấy thời gian thực hiện
   * @returns {Date} Thời gian thực hiện
   */
  get timestamp(): Date {
    return this.timestampValue;
  }

  /**
   * Lấy thông tin bổ sung
   * @returns {Record<string, unknown> | undefined} Thông tin bổ sung
   */
  get metadata(): Record<string, unknown> | undefined {
    return this.metadataValue;
  }
}
