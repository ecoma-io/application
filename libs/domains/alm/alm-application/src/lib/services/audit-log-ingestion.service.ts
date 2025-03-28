import { ICommandBus } from '@ecoma/common-application';
import { PersistAuditLogCommand } from '../commands/persist-audit-log.command';
import { IDomainEventPublisher } from '../interfaces/message-broker/domain-event.publisher';
import { AuditLogIngestionFailedEvent, Initiator } from '@ecoma/alm-domain';

/**
 * Interface định nghĩa cấu trúc của một audit log event
 */
interface IAuditLogEvent {
  id: string;
  initiator: Initiator;
  boundedContext: string;
  actionType: string;
  category?: string;
  severity?: string;
  entityId?: string;
  entityType?: string;
  description?: string;
  constructor: { name: string };
}

/**
 * Service xử lý việc tiếp nhận và lưu trữ audit log
 * @class
 */
export class AuditLogIngestionService {
  constructor(
    private readonly commandBus: ICommandBus,
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  /**
   * Xử lý một event để lưu trữ thành audit log
   * @param {IAuditLogEvent} event Event cần xử lý
   * @returns {Promise<void>}
   */
  async processEvent(event: IAuditLogEvent): Promise<void> {
    try {
      // Tạo command từ event
      const command = new PersistAuditLogCommand(
        event.id,
        new Date(),
        event.initiator,
        event.boundedContext,
        event.actionType,
        event.category,
        event.severity,
        event.entityId,
        event.entityType,
        event.description
      );

      // Gửi command để xử lý
      await this.commandBus.execute(command);
    } catch (error) {
      // Nếu xử lý thất bại, phát event thông báo lỗi
      const receivedAt = new Date();
      const failedEvent = new AuditLogIngestionFailedEvent(
        event.constructor.name,
        error instanceof Error ? error.message : 'Unknown error',
        receivedAt,
        new Date(),
        undefined,
        event.id,
      );

      await this.eventPublisher.publish(failedEvent);
    }
  }
}
