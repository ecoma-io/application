import { IRetentionPolicyProps, RetentionPolicy } from "@ecoma/alm-domain";
import { IWriteRepository, UuidId } from "@ecoma/common-domain";

/**
 * Repository interface cho ghi RetentionPolicy (Command side)
 * @see RetentionPolicy
 */

export interface IRetentionPolicyWriteRepo
  extends IWriteRepository<UuidId, IRetentionPolicyProps, RetentionPolicy> {
  /**
   * Cập nhật một phần thuộc tính của RetentionPolicy
   */
  update(id: UuidId, update: Partial<IRetentionPolicyProps>): Promise<void>;
}
