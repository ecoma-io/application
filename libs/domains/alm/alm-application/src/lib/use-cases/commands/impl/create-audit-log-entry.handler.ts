import { AuditLogEntry, AuditLogStatus } from '@ecoma/alm-domain';
import { CreateAuditLogEntryCommandDto } from '../../../dtos';
import { AuditLogEntryDtoMapper } from '../../../mappers';
import { IAuditLogEntryRepositoryPort, IDomainEventPublisherPort } from '../../../ports';
import { IUseCase, ILogger } from '@ecoma/common-application';
import { validateSync } from 'class-validator';

/**
 * Interface cho Command handler xử lý việc tạo một bản ghi kiểm tra mới.
 */
export interface ICreateAuditLogEntryHandler {
  execute(command: CreateAuditLogEntryCommandDto): Promise<string>;
}

/**
 * Command handler xử lý việc tạo một bản ghi kiểm tra mới.
 */
export class CreateAuditLogEntryHandler implements IUseCase<CreateAuditLogEntryCommandDto, string> {
  /**
   * Constructor
   * @param auditLogEntryRepository Repository để lưu bản ghi kiểm tra
   * @param auditLogEntryMapper Mapper để chuyển đổi giữa DTO và domain
   * @param eventPublisher Publisher để xuất bản domain event
   * @param logger Logger để ghi log
   */
  constructor(
    private readonly auditLogEntryRepository: IAuditLogEntryRepositoryPort,
    private readonly auditLogEntryMapper: AuditLogEntryDtoMapper,
    private readonly eventPublisher: IDomainEventPublisherPort,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý command tạo bản ghi kiểm tra
   * @param command Command DTO với thông tin bản ghi
   * @returns ID của bản ghi đã tạo
   */
  async execute(command: CreateAuditLogEntryCommandDto): Promise<string> {
    const errors = validateSync(command, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      const errorMessages = errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ');
      this.logger.error('Validation failed for CreateAuditLogEntryCommandDto', new Error(errorMessages));
      throw new Error('Invalid command payload');
    }
    this.logger.info('Start processing CreateAuditLogEntryHandler', { command });
    try {
      this.logger.debug('Mapping command DTO to domain entity', { command });
      const auditLogEntry = this.auditLogEntryMapper.toAuditLogEntryDomain(command);
      if (!command.status) {
        command.status = AuditLogStatus.Success;
      }
      await this.auditLogEntryRepository.save(auditLogEntry);
      this.logger.debug('Audit log entry saved', { id: auditLogEntry.stringId });
      const domainEvents = auditLogEntry.getDomainEvents();
      for (const event of domainEvents) {
        await this.eventPublisher.publish(event);
      }
      auditLogEntry.clearDomainEvents();
      this.logger.info('Finished processing CreateAuditLogEntryHandler', { id: auditLogEntry.stringId });
      return auditLogEntry.stringId;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error occurred in CreateAuditLogEntryHandler', error);
      } else {
        this.logger.error('Error occurred in CreateAuditLogEntryHandler', new Error(String(error)));
      }
      throw error;
    }
  }
}
