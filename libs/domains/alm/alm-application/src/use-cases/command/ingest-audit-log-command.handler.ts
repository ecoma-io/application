import {
  AuditContext,
  AuditLogEntry,
  IAuditLogEntryProps,
  Initiator,
} from "@ecoma/alm-domain";
import {
  AbstractCommandUseCase,
  AbstractLogger,
  GenericResult,
} from "@ecoma/common-application";
import { IngestAuditLogDto } from "../../dto";
import { AuditLogEntryFactory } from "../../factories";
import { IAuditLogWriteRepository } from "../../ports";

export class IngestAuditLogCommandHandler extends AbstractCommandUseCase<
  IngestAuditLogDto,
  GenericResult<void>
> {
  constructor(
    private readonly auditLogWriteRepo: IAuditLogWriteRepository,
    private readonly auditLogEntryFactory: AuditLogEntryFactory,
    private readonly logger: AbstractLogger
  ) {
    super();
    this.logger.setContext(IngestAuditLogCommandHandler.name);
  }

  protected override async handle(
    command: IngestAuditLogDto
  ): Promise<GenericResult<void>> {
    // Tạo log identifier để theo dõi
    const logId = `audit_${command.entityType}_${
      command.entityId || "unknown"
    }_${Date.now()}`;

    try {
      // Log INFO với thông tin cơ bản
      this.logger.info(`Processing audit log [${logId}]`, {
        category: command.category,
        actionType: command.actionType,
        entityType: command.entityType,
        entityId: command.entityId,
        tenantId: command.tenantId,
        initiatorType: command.initiator.type,
      });

      // Chi tiết command chỉ ở DEBUG
      this.logger.debug(`Audit command details [${logId}]`, {
        boundedContext: command.boundedContext,
        timestamp: command.timestamp,
        initiatorId: command.initiator.id,
        initiatorName: command.initiator.name,
        // Không log userAgent và IP vì có thể nhạy cảm
      });

      const auditLogEntry = this.toDomainModel(command);

      // Log thông tin auditLogEntry chi tiết hơn
      this.logger.debug(`Domain model created [${logId}]`, {
        id: auditLogEntry.id,
        // Không truy cập trực tiếp vào props vì protected
        timestamp: command.timestamp,
        boundedContext: command.boundedContext,
      });

      await this.auditLogWriteRepo.save(auditLogEntry);

      // Log INFO khi hoàn thành thành công
      this.logger.info(`Audit log saved successfully [${logId}]`);

      return { success: true };
    } catch (err) {
      // Log ERROR khi gặp lỗi
      const error = err as Error;

      // Log cơ bản để tránh vấn đề với kiểu dữ liệu
      this.logger.error(
        `Failed to process audit log [${logId}] for ${command.entityType}:${command.entityId} - ${error.message}`
      );

      // Log chi tiết hơn nếu cần
      this.logger.debug(`Error details for [${logId}]`, { stack: error.stack });

      return {
        success: false,
        error: `Error ingesting audit log: ${error.message}`,
      };
    }
  }

  private toDomainModel(command: IngestAuditLogDto): AuditLogEntry {
    const props: Omit<IAuditLogEntryProps, "id"> = {
      timestamp: new Date(command.timestamp),
      boundedContext: command.boundedContext,
      actionType: command.actionType,
      category: command.category,
      entityId: command.entityId,
      entityType: command.entityType,
      tenantId: command.tenantId,
      initiator: new Initiator({
        type: command.initiator.type,
        name: command.initiator.name,
        id: command.initiator.id,
        ipAddress: command.initiator.ipAddress,
        userAgent: command.initiator.userAgent,
      }),
      contextData: command.contextData
        ? new AuditContext({ ...command.contextData })
        : undefined,
    };

    return this.auditLogEntryFactory.create(props);
  }
}
