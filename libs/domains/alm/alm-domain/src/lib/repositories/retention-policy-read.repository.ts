import { IReadRepository } from "@ecoma/common-domain";
import { RetentionPolicy } from "../aggregates";
import { RetentionPolicyId } from "../value-objects";

/**
 * Interface định nghĩa các phương thức đọc dữ liệu của Retention Policy
 * @interface IRetentionPolicyReadRepository
 * @extends {IReadRepository<RetentionPolicyId, RetentionPolicy>}
 */
export interface IRetentionPolicyReadRepository
  extends IReadRepository<RetentionPolicyId, RetentionPolicy> {
  /**
   * Tìm các retention policy theo bounded context
   * @param {string} boundedContext - Bounded context cần tìm
   * @returns {Promise<RetentionPolicy[]>} Danh sách retention policy
   */
  findByBoundedContext(boundedContext: string): Promise<RetentionPolicy[]>;

  /**
   * Tìm các retention policy theo tenant ID
   * @param {string} tenantId - ID của tenant
   * @returns {Promise<RetentionPolicy[]>} Danh sách retention policy
   */
  findByTenantId(tenantId: string): Promise<RetentionPolicy[]>;

  /**
   * Tìm các retention policy đang active
   * @returns {Promise<RetentionPolicy[]>} Danh sách retention policy đang active
   */
  findActive(): Promise<RetentionPolicy[]>;

  /**
   * Tìm các retention policy theo loại hành động
   * @param {string} actionType - Loại hành động cần tìm
   * @returns {Promise<RetentionPolicy[]>} Danh sách retention policy
   */
  findByActionType(actionType: string): Promise<RetentionPolicy[]>;

  /**
   * Tìm các retention policy theo loại entity
   * @param {string} entityType - Loại entity cần tìm
   * @returns {Promise<RetentionPolicy[]>} Danh sách retention policy
   */
  findByEntityType(entityType: string): Promise<RetentionPolicy[]>;

  /**
   * Tìm các retention policy theo thời gian lưu trữ
   * @param {number} durationValue - Giá trị thời gian
   * @param {'Day' | 'Month' | 'Year'} durationUnit - Đơn vị thời gian
   * @returns {Promise<RetentionPolicy[]>} Danh sách retention policy
   */
  findByRetentionDuration(
    durationValue: number,
    durationUnit: "Day" | "Month" | "Year"
  ): Promise<RetentionPolicy[]>;
}
