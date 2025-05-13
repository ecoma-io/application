import { RetentionPolicy } from "../value-objects/retention-policy/retention-policy.vo";

/**
 * Domain service để làm việc với Retention Policies
 *
 * Đây là interface định nghĩa các chức năng nghiệp vụ liên quan đến Retention Policy
 */
export interface IRetentionPolicyService {
  /**
   * Áp dụng chính sách lưu trữ
   * @param policy Chính sách cần áp dụng
   */
  applyPolicy(policy: RetentionPolicy): Promise<void>;
}
