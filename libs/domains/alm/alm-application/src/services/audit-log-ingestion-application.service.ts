import {
  AuditContext,
  AuditLogEntry,
  Initiator,
  InitiatorType,
  Severity,
  Status,
} from "@ecoma/alm-domain";
import { Injectable } from "@nestjs/common";

import { IngestAuditLogCommandDto } from "../dtos";
import { IAuditLogIdFactory } from "../factories";
import { IAuditLogEntryWriteRepo } from "../ports";

/**
 * Service xử lý việc tiếp nhận và lưu trữ các bản ghi audit log.
 */
@Injectable()
export class AuditLogIngestionApplicationService {
  /**
   * Khởi tạo service tiếp nhận audit log.
   * @param auditLogRepo - Repository để lưu trữ audit log
   * @param auditLogIdFactory - Factory để tạo ID cho audit log
   */
  constructor(
    private readonly auditLogRepo: IAuditLogEntryWriteRepo,
    private readonly auditLogIdFactory: IAuditLogIdFactory
  ) {}

  /**
   * Xử lý yêu cầu tạo mới một bản ghi audit log.
   * @param dto - Dữ liệu của bản ghi audit log cần tạo
   */
  async handleAuditLogRequestedEvent(
    dto: IngestAuditLogCommandDto
  ): Promise<void> {
    const auditLog = new AuditLogEntry({
      id: this.auditLogIdFactory.create(),
      timestamp: new Date(dto.timestamp),
      initiator: new Initiator({
        type: dto.initiator.type as InitiatorType,
        id: dto.initiator.id,
        name: dto.initiator.name,
      }),
      boundedContext: dto.boundedContext,
      actionType: dto.actionType,
      category: dto.category,
      severity: dto.severity as Severity | undefined,
      entityId: dto.entityId,
      entityType: dto.entityType,
      tenantId: dto.tenantId,
      contextData: dto.contextData
        ? new AuditContext(dto.contextData.value || {})
        : undefined,
      status:
        dto.status === "Success"
          ? Status.Success
          : dto.status === "Failure"
          ? Status.Failure
          : Status.Pending,
      errorMessage: dto.failureReason,
      createdAt: new Date(),
    });

    await this.auditLogRepo.save(auditLog);
  }
}
