import { IRetentionPolicyProps, RetentionPolicy } from "@ecoma/alm-domain";
import { IReadRepository, UuidId } from "@ecoma/common-domain";

/**
 * Repository interface cho đọc RetentionPolicy (Query side)
 * @see RetentionPolicy
 */
export interface IRetentionPolicyReadRepo
  extends IReadRepository<UuidId, IRetentionPolicyProps, RetentionPolicy> {
  /**
   * Tìm tất cả policy đang hoạt động
   */
  findActive(): Promise<RetentionPolicy[]>;
  /**
   * Tìm policy theo tên
   */
  findByName(name: string): Promise<RetentionPolicy | null>;
}
