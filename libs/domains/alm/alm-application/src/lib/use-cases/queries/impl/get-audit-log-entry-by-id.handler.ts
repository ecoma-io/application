import { AuditLogEntryDto, GetAuditLogEntryByIdQueryDto } from '../../../dtos';
import { AuditLogNotFoundError } from '../../../errors';
import { AuditLogEntryDtoMapper } from '../../../mappers';
import { IAuditLogEntryRepositoryPort } from '../../../ports';
import { IUseCase, ILogger } from '@ecoma/common-application';
import { UuidId } from '@ecoma/common-domain';
import { validateSync } from 'class-validator';

/**
 * Query handler xử lý việc lấy một bản ghi kiểm tra theo ID.
 */
export class GetAuditLogEntryByIdHandler implements IUseCase<GetAuditLogEntryByIdQueryDto, AuditLogEntryDto> {
  /**
   * Constructor
   * @param auditLogEntryRepository Repository để truy vấn bản ghi kiểm tra
   * @param auditLogEntryMapper Mapper để chuyển đổi giữa DTO và domain
   * @param logger Logger để ghi log thông tin
   */
  constructor(
    private readonly auditLogEntryRepository: IAuditLogEntryRepositoryPort,
    private readonly auditLogEntryMapper: AuditLogEntryDtoMapper,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý query lấy bản ghi kiểm tra theo ID
   * @param query Query DTO với ID của bản ghi cần lấy
   * @returns DTO của bản ghi kiểm tra
   * @throws AuditLogNotFoundError nếu không tìm thấy bản ghi
   */
  async execute(query: GetAuditLogEntryByIdQueryDto): Promise<AuditLogEntryDto> {
    const errors = validateSync(query, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      const errorMessages = errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ');
      this.logger.error('Validation failed for GetAuditLogEntryByIdQueryDto', new Error(errorMessages));
      throw new AuditLogNotFoundError('Invalid query criteria');
    }
    this.logger.info('Start processing GetAuditLogEntryByIdHandler', { query });
    try {
      this.logger.debug('Mapping query DTO to domain ID', { id: query.id });
      const id = new UuidId(query.id);
      const auditLogEntry = await this.auditLogEntryRepository.findById(id);
      if (!auditLogEntry) {
        this.logger.info('Audit log entry not found', { id: query.id });
        throw new AuditLogNotFoundError(query.id);
      }
      this.logger.debug('Mapping domain to DTO', { id: query.id });
      const result = this.auditLogEntryMapper.toDto(auditLogEntry);
      this.logger.info('Finished processing GetAuditLogEntryByIdHandler', { id: query.id });
      return result;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error occurred in GetAuditLogEntryByIdHandler', error);
      } else {
        this.logger.error('Error occurred in GetAuditLogEntryByIdHandler', new Error(String(error)));
      }
      throw error;
    }
  }
}
