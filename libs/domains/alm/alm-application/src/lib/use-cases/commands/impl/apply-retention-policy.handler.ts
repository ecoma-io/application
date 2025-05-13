import { AuditLogQueryCriteria, RetentionPolicy } from '@ecoma/alm-domain';
import { ApplyRetentionPolicyCommandDto } from '../../../dtos';
import { IAuditLogEntryRepositoryPort, IDomainEventPublisherPort, IRetentionPolicyRepositoryPort } from '../../../ports';
import { AbstractDomainEvent } from '@ecoma/common-domain';
import { IUseCase, ILogger } from '@ecoma/common-application';
import { validateSync } from 'class-validator';

/**
 * Domain event được phát ra khi áp dụng chính sách retention
 */
export class AuditLogRetentionAppliedEvent extends AbstractDomainEvent {
  constructor(
    public readonly policyId: string,
    public readonly deletedCount: number,
  ) {
    super();
  }
}

/**
 * Command handler xử lý việc áp dụng chính sách retention.
 */
export class ApplyRetentionPolicyHandler implements IUseCase<ApplyRetentionPolicyCommandDto, number> {
  /**
   * Constructor
   * @param retentionPolicyRepository Repository để truy vấn chính sách retention
   * @param auditLogEntryRepository Repository để quản lý bản ghi kiểm tra
   * @param eventPublisher Publisher để xuất bản domain event
   * @param logger Logger để ghi log
   */
  constructor(
    private readonly retentionPolicyRepository: IRetentionPolicyRepositoryPort,
    private readonly auditLogEntryRepository: IAuditLogEntryRepositoryPort,
    private readonly eventPublisher: IDomainEventPublisherPort,
    private readonly logger: ILogger,
  ) {}

  /**
   * Xử lý command áp dụng chính sách retention
   * @param command Command DTO chứa ID của chính sách cần áp dụng
   * @returns Số lượng bản ghi đã xóa
   */
  async execute(command: ApplyRetentionPolicyCommandDto): Promise<number> {
    const errors = validateSync(command, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      const errorMessages = errors.map(e => Object.values(e.constraints || {}).join(', ')).join('; ');
      this.logger.error('Validation failed for ApplyRetentionPolicyCommandDto', new Error(errorMessages));
      throw new Error('Invalid command payload');
    }
    this.logger.info('Start processing ApplyRetentionPolicyHandler', { command });
    try {
      this.logger.debug('Lấy policy từ repository', { policyId: command.policyId });
      const policyId = command.policyId;
      if (!policyId) {
        this.logger.info('Không có policyId, bỏ qua', { command });
        return 0;
      }
      const policyResult = await this.retentionPolicyRepository.findById(policyId);
      if (!policyResult) {
        this.logger.info('Không tìm thấy policy', { policyId });
        return 0;
      }
      const deletedCount = await this.applyPolicy(policyResult.policy, policyId);
      if (deletedCount > 0) {
        await this.eventPublisher.publish(
          new AuditLogRetentionAppliedEvent(policyId, deletedCount)
        );
      }
      this.logger.info('Hoàn thành xử lý ApplyRetentionPolicyHandler', { policyId, deletedCount });
      return deletedCount;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Lỗi khi xử lý ApplyRetentionPolicyHandler', error);
      } else {
        this.logger.error('Lỗi khi xử lý ApplyRetentionPolicyHandler', new Error(String(error)));
      }
      throw error;
    }
  }

  /**
   * Áp dụng một chính sách retention cụ thể
   * @param policy Chính sách retention
   * @param policyId ID của chính sách
   * @returns Số lượng bản ghi đã xóa
   * @private
   */
  private async applyPolicy(policy: RetentionPolicy, policyId: string): Promise<number> {
    let deletedCount = 0;
    try {
      const criteria = AuditLogQueryCriteria.create({
        pageNumber: 1,
        pageSize: 100,
      });
      let hasMore = true;
      while (hasMore) {
        const { items, total } = await this.auditLogEntryRepository.findByCriteria(criteria);
        if (items.length === 0) {
          hasMore = false;
          continue;
        }
        for (const item of items) {
          await this.auditLogEntryRepository.delete(item.id);
          deletedCount++;
        }
        hasMore = items.length < total;
      }
    } catch (error) {
      this.logger.error(`Error applying retention policy ${policyId}`, error instanceof Error ? error : new Error(String(error)));
    }
    return deletedCount;
  }
}
