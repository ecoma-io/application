import {
  IRetentionPolicyProps,
  RetentionPolicy,
  RetentionPolicyId,
} from "@ecoma/alm-domain";
import { v4 as uuidv4 } from "uuid";

import { CreateRetentionPolicyCommandDto } from "../dtos/commands/create-retention-policy.command.dto";
import { UpdateRetentionPolicyCommandDto } from "../dtos/commands/update-retention-policy.command.dto";

export class RetentionPolicyMapper {
  /**
   * Chuyển từ CreateRetentionPolicyCommandDto sang RetentionPolicy domain object
   * @param dto
   */
  static fromCreateDto(dto: CreateRetentionPolicyCommandDto): RetentionPolicy {
    return new RetentionPolicy({
      id: new RetentionPolicyId(uuidv4()),
      name: dto.name,
      description: dto.description,
      boundedContext: dto.boundedContext,
      actionType: dto.actionType,
      entityType: dto.entityType,
      tenantId: dto.tenantId,
      retentionDays: dto.retentionDays,
      isActive: dto.isActive,
      createdAt: new Date(),
    });
  }

  /**
   * Chuyển từ UpdateRetentionPolicyCommandDto sang RetentionPolicy domain object
   * @param dto
   */
  static fromUpdateDto(
    dto: UpdateRetentionPolicyCommandDto
  ): Partial<IRetentionPolicyProps> {
    return {
      name: dto.name,
      description: dto.description,
      boundedContext: dto.boundedContext,
      actionType: dto.actionType,
      entityType: dto.entityType,
      tenantId: dto.tenantId,
      retentionDays: dto.retentionDays,
      isActive: dto.isActive,
    };
  }

  /**
   * Chuyển từ RetentionPolicy domain object sang DTO cho query
   * @param policy
   */
  static toQueryDto(policy: RetentionPolicy): any {
    return {
      id: policy.id.toString(),
      name: policy.name,
      description: policy.description,
      boundedContext: policy.boundedContext,
      actionType: policy.actionType,
      entityType: policy.entityType,
      tenantId: policy.tenantId,
      retentionDays: policy.retentionDays,
      isActive: policy.isActive,
      createdAt: policy.createdAt,
      updatedAt: policy.updatedAt,
    };
  }
}
