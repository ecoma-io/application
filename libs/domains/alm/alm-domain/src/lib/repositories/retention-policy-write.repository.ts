import { IWriteRepository } from "@ecoma/common-domain";
import { RetentionPolicy } from "../aggregates";
import { RetentionPolicyId, RetentionRule } from "../value-objects";

/**
 * Interface định nghĩa các phương thức ghi dữ liệu của Retention Policy
 * @interface IRetentionPolicyWriteRepository
 * @extends {IWriteRepository<RetentionPolicyId, RetentionPolicy>}
 */
export interface IRetentionPolicyWriteRepository
  extends IWriteRepository<RetentionPolicyId, RetentionPolicy> {
  /**
   * Cập nhật thông tin của một retention policy
   * @param {RetentionPolicy} policy - Retention policy cần cập nhật
   * @returns {Promise<void>}
   */
  update(policy: RetentionPolicy): Promise<void>;

  /**
   * Kích hoạt một retention policy
   * @param {RetentionPolicyId} id - ID của retention policy cần kích hoạt
   * @returns {Promise<void>}
   */
  activate(id: RetentionPolicyId): Promise<void>;

  /**
   * Vô hiệu hóa một retention policy
   * @param {RetentionPolicyId} id - ID của retention policy cần vô hiệu hóa
   * @returns {Promise<void>}
   */
  deactivate(id: RetentionPolicyId): Promise<void>;

  /**
   * Cập nhật danh sách các rule của một retention policy
   * @param {RetentionPolicyId} id - ID của retention policy cần cập nhật rules
   * @param {RetentionRule[]} rules - Danh sách các rule mới
   * @returns {Promise<void>}
   */
  updateRules(id: RetentionPolicyId, rules: RetentionRule[]): Promise<void>;
}
