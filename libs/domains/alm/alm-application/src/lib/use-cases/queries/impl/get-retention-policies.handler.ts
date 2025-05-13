import { GetRetentionPoliciesQueryDto, RetentionPolicyDto } from '../../../dtos';
import { RetentionPolicyDtoMapper } from '../../../mappers';
import { IRetentionPolicyRepositoryPort } from '../../../ports';
import { IUseCase, ILogger } from '@ecoma/common-application';
import { validateSync } from 'class-validator';

/**
 * Interface cho Query handler xử lý việc lấy danh sách chính sách retention.
 */
export interface IGetRetentionPoliciesHandler {
  execute(query: GetRetentionPoliciesQueryDto): Promise<RetentionPolicyDto[]>;
}

/**
 * Query handler xử lý việc lấy danh sách chính sách retention.
 */
export class GetRetentionPoliciesHandler implements IUseCase<GetRetentionPoliciesQueryDto, RetentionPolicyDto[]> {
  /**
   * Constructor
   * @param retentionPolicyRepository Repository để truy vấn chính sách retention
   * @param retentionPolicyMapper Mapper để chuyển đổi giữa DTO và domain
   * @param logger Logger để ghi log
   */
  constructor(
    private readonly retentionPolicyRepository: IRetentionPolicyRepositoryPort,
    private readonly retentionPolicyMapper: RetentionPolicyDtoMapper,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý query lấy danh sách chính sách retention
   * @param query Query DTO với tham số lọc
   * @returns Danh sách chính sách retention dưới dạng DTO
   */
  async execute(query: GetRetentionPoliciesQueryDto): Promise<RetentionPolicyDto[]> {
    const errors = validateSync(query, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      const errorMessages = errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ');
      this.logger.error('Validation failed for GetRetentionPoliciesQueryDto', new Error(errorMessages));
      throw new Error('Invalid query criteria');
    }
    this.logger.info('Start processing GetRetentionPoliciesHandler', { query });
    try {
      this.logger.debug('Fetching retention policies', { isActive: query.isActive });
      const policies = await this.retentionPolicyRepository.findAll(query.isActive);
      this.logger.debug('Mapping domain to DTO', { count: policies.length });
      const result = policies.map(p => this.retentionPolicyMapper.toDto(p.policy, p.id));
      this.logger.info('Finished processing GetRetentionPoliciesHandler', { count: result.length });
      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error occurred in GetRetentionPoliciesHandler', error);
      } else {
        this.logger.error('Error occurred in GetRetentionPoliciesHandler', new Error(String(error)));
      }
      throw error;
    }
  }
}
