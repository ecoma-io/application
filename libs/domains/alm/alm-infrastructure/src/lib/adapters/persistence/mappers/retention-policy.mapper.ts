import { RetentionPolicy, RetentionPolicyId } from "@ecoma/alm-domain";

import { RetentionPolicyEntity } from "../entities/retention-policy.entity";

/**
 * Lớp Mapper chuyển đổi giữa đối tượng domain RetentionPolicy và thực thể MongoDB.
 */
export class RetentionPolicyMapper {
  /**
   * Phương thức chuyển đổi từ đối tượng domain sang thực thể MongoDB.
   * @param policy Đối tượng domain RetentionPolicy cần chuyển đổi.
   * @returns Một phần của thực thể RetentionPolicyEntity sau khi chuyển đổi.
   */
  static toPersistence(
    policy: RetentionPolicy
  ): Partial<RetentionPolicyEntity> {
    return {
      id: policy.id.value,
      tenantId: policy.tenantId,
      name: policy.name,
      description: policy.description,
      boundedContext: policy.boundedContext,
      actionType: policy.actionType,
      entityType: policy.entityType,
      retentionDays: policy.retentionDays,
      isActive: policy.isActive,
      createdAt: policy.createdAt,
      updatedAt: policy.updatedAt,
    };
  }

  /**
   * Phương thức chuyển đổi từ thực thể MongoDB sang đối tượng domain.
   * @param entity Thực thể RetentionPolicyEntity cần chuyển đổi.
   * @returns Đối tượng domain RetentionPolicy sau khi chuyển đổi.
   */
  static toDomain(entity: RetentionPolicyEntity): RetentionPolicy {
    return new RetentionPolicy({
      id: new RetentionPolicyId(entity.id),
      tenantId: entity.tenantId,
      name: entity.name,
      description: entity.description,
      boundedContext: entity.boundedContext,
      actionType: entity.actionType,
      entityType: entity.entityType,
      retentionDays: entity.retentionDays,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
