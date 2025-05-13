import { RetentionPolicy } from "../../value-objects/retention-policy/retention-policy.vo";

/**
 * Port định nghĩa các service bên ngoài cho quản lý retention policy
 */
export interface IExternalRetentionPolicyService {
  /**
   * Áp dụng chính sách lưu trữ
   * @param policy Chính sách cần áp dụng
   */
  applyPolicy(policy: RetentionPolicy): Promise<void>;
}
