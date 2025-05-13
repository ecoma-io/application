import { FindAuditLogEntriesQueryDto, PaginatedAuditLogEntriesResponseDto } from '../../../dtos';
import { InvalidQueryCriteriaError } from '../../../errors';
import { AuditLogEntryDtoMapper } from '../../../mappers';
import { IAuditLogEntryRepositoryPort } from '../../../ports';
import { IUseCase } from '@ecoma/common-application';
import { ILogger } from '@ecoma/common-application';
import { validateSync } from 'class-validator';

/**
 * Interface cho Query handler xử lý việc tìm kiếm các bản ghi kiểm tra theo tiêu chí.
 */
export interface IFindAuditLogEntriesHandler {
  execute(query: FindAuditLogEntriesQueryDto): Promise<PaginatedAuditLogEntriesResponseDto>;
}

/**
 * Query handler xử lý việc tìm kiếm các bản ghi kiểm tra theo tiêu chí.
 */
export class FindAuditLogEntriesHandler implements IUseCase<FindAuditLogEntriesQueryDto, PaginatedAuditLogEntriesResponseDto> {
  /**
   * Constructor
   * @param auditLogEntryRepository Repository để truy vấn bản ghi kiểm tra
   * @param auditLogEntryMapper Mapper để chuyển đổi giữa DTO và domain
   * @param logger Logger để ghi log thông tin và lỗi
   */
  constructor(
    private readonly auditLogEntryRepository: IAuditLogEntryRepositoryPort,
    private readonly auditLogEntryMapper: AuditLogEntryDtoMapper,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý query tìm kiếm bản ghi kiểm tra
   * @param query Query DTO với tiêu chí tìm kiếm
   * @returns DTO phân trang với kết quả tìm kiếm
   */
  async execute(query: FindAuditLogEntriesQueryDto): Promise<PaginatedAuditLogEntriesResponseDto> {
    const errors = validateSync(query, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      const errorMessages = errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ');
      this.logger.error('Validation failed for FindAuditLogEntriesQueryDto', new Error(errorMessages));
      throw new InvalidQueryCriteriaError('Invalid query criteria');
    }
    this.logger.info('Start processing FindAuditLogEntriesHandler', { query });
    try {
      this.logger.debug('Mapping query DTO to domain criteria', { query });
      const criteria = this.auditLogEntryMapper.toDomain(query);
      const { items, total } = await this.auditLogEntryRepository.findByCriteria(criteria);
      this.logger.debug('Mapping result to paginated DTO', { total });
      const result = this.auditLogEntryMapper.toPaginatedDto(items, total, criteria);
      this.logger.info('Finished processing FindAuditLogEntriesHandler', { total });
      return result;
    } catch (error) {
      this.logger.error('Error occurred in FindAuditLogEntriesHandler', error instanceof Error ? error : new Error(String(error)));
      if (error instanceof Error) {
        throw new InvalidQueryCriteriaError(error.message);
      }
      throw new InvalidQueryCriteriaError('Unknown error during query execution');
    }
  }
}
