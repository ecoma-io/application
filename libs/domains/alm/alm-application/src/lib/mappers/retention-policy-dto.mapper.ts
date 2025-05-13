import { RetentionPolicy, RetentionRule } from '@ecoma/alm-domain'
import { RetentionPolicyDto, RetentionRuleDto } from '../dtos';

/**
 * Mapper chuyển đổi giữa RetentionPolicy Domain và DTO.
 */
  export class RetentionPolicyDtoMapper {
  /**
   * Chuyển đổi từ Domain RetentionPolicy sang DTO.
   * @param domain RetentionPolicy domain object
   * @param id ID của chính sách (nếu đã lưu)
   * @returns RetentionPolicyDto
   */
  public toDto(domain: RetentionPolicy, id?: string): RetentionPolicyDto {
    const dto = new RetentionPolicyDto();
    dto.id = id;
    dto.name = domain.name;
    dto.description = domain.description;
    dto.isActive = domain.isActive;
    dto.rules = domain.rules.map(rule => this.toRuleDto(rule));
    return dto;
  }

  /**
   * Chuyển đổi danh sách Domain RetentionPolicy sang DTO.
   * @param domains Danh sách RetentionPolicy domain objects với ID tương ứng
   * @returns Danh sách RetentionPolicyDto
   */
  public toDtos(domains: Array<{ policy: RetentionPolicy; id: string }>): RetentionPolicyDto[] {
    return domains.map(({ policy, id }) => this.toDto(policy, id));
  }

  /**
   * Chuyển đổi từ DTO RetentionPolicyDto sang Domain RetentionPolicy.
   * @param dto RetentionPolicyDto object
   * @returns RetentionPolicy domain object
   */
  public toDomain(dto: RetentionPolicyDto): RetentionPolicy {
    const rules = dto.rules.map(ruleDto => this.toRuleDomain(ruleDto));
    return RetentionPolicy.create(dto.name, dto.description, rules, dto.isActive);
  }

  /**
   * Chuyển đổi từ Domain RetentionRule sang DTO.
   * @param domain RetentionRule domain object
   * @returns RetentionRuleDto
   */
  private toRuleDto(domain: RetentionRule): RetentionRuleDto {
    const dto = new RetentionRuleDto();
    dto.boundedContext = domain.boundedContext;
    dto.actionType = domain.actionType;
    dto.entityType = domain.entityType;
    dto.tenantId = domain.tenantId;
    dto.retentionDuration = domain.retentionDuration;
    return dto;
  }

  /**
   * Chuyển đổi từ DTO RetentionRuleDto sang Domain RetentionRule.
   * @param dto RetentionRuleDto object
   * @returns RetentionRule domain object
   */
  private toRuleDomain(dto: RetentionRuleDto): RetentionRule {
    return RetentionRule.create(
      dto.retentionDuration,
      dto.boundedContext,
      dto.actionType,
      dto.entityType,
      dto.tenantId
    );
  }
}
