/**
 * @fileoverview Controller xử lý các NATS message patterns cho audit logs
 * @since 1.0.0
 */

import { AuditLogEntry } from "@ecoma/alm-domain";
import {
  BadRequestException,
  Controller,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuditLogsService, IAuditLogQueryParams } from "./audit-logs.service";
import { AuditLogDto, PaginatedAuditLogResponseDto } from "./dto/audit-log.dto";

/**
 * Controller xử lý các NATS message patterns cho audit logs
 */
@Controller()
export class AuditLogsController {
  private readonly logger = new Logger(AuditLogsController.name);

  constructor(private readonly auditLogsService: AuditLogsService) {}

  /**
   * Truy vấn danh sách audit logs
   * @param {IAuditLogQueryParams} params - Tham số truy vấn
   * @returns {Promise<PaginatedAuditLogResponseDto>} Danh sách audit logs được phân trang
   */
  @MessagePattern({ cmd: "get-audit-logs" })
  async getAuditLogs(
    @Payload() params: IAuditLogQueryParams
  ): Promise<PaginatedAuditLogResponseDto> {
    this.logger.log(`Nhận yêu cầu get-audit-logs: ${JSON.stringify(params)}`);

    // Validate tenantId
    if (!params.tenantId) {
      this.logger.warn("Thiếu tenantId trong yêu cầu get-audit-logs");
      throw new BadRequestException("tenantId là bắt buộc");
    }

    try {
      const result = await this.auditLogsService.getAuditLogs(params);

      const response: PaginatedAuditLogResponseDto = {
        items: result.items.map((entry) => this.mapToDto(entry)),
        total: result.total,
        page: Math.floor(result.offset / result.limit) + 1,
        pageSize: result.limit,
      };

      this.logger.log(
        `Trả về ${response.items.length}/${response.total} audit logs`
      );
      return response;
    } catch (error) {
      this.logger.error(`Lỗi khi lấy danh sách audit logs: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lấy chi tiết audit log theo ID
   * @param {object} params - Tham số chứa ID
   * @returns {Promise<AuditLogDto>} Chi tiết audit log
   */
  @MessagePattern({ cmd: "get-audit-log-by-id" })
  async getAuditLogById(
    @Payload() params: { id: string }
  ): Promise<AuditLogDto> {
    this.logger.log(`Nhận yêu cầu get-audit-log-by-id: ${params.id}`);

    if (!params.id) {
      this.logger.warn("Thiếu ID trong yêu cầu get-audit-log-by-id");
      throw new BadRequestException("ID là bắt buộc");
    }

    try {
      const auditLog = await this.auditLogsService.getAuditLogById(params.id);
      return this.mapToDto(auditLog);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(`Không tìm thấy audit log với ID: ${params.id}`);
      } else {
        this.logger.error(`Lỗi khi lấy audit log: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Chuyển đổi AuditLogEntry từ domain model sang DTO
   * @param {AuditLogEntry} entry - Audit log entry
   * @returns {AuditLogDto} Audit log DTO
   */
  private mapToDto(entry: AuditLogEntry): AuditLogDto {
    return {
      id: entry.getIdentifier(),
      tenantId: entry.tenantId ?? "",
      timestamp: entry.timestamp,
      eventId: entry.eventId ?? undefined,
      category: entry.category ?? undefined,
      severity: entry.severity ?? undefined,
      boundedContext: entry.boundedContext,
      actionType: entry.actionType,
      status: entry.status,
      action: entry.action,
      initiator: entry.initiator
        ? {
            type: entry.initiator.type,
            id: entry.initiator.id ?? undefined,
            name: entry.initiator.name ?? undefined,
          }
        : (undefined as any), // Casting để tránh lỗi type
      resource: entry.resource
        ? {
            type: entry.resource.type,
            id: entry.resource.id,
            name: entry.resource.name,
          }
        : undefined,
      changes: entry.changes,
      context: entry.context,
      entityType: entry.entityType ?? undefined,
      entityId: entry.entityId ?? undefined,
      metadata: entry.metadata,
      failureReason: entry.failureReason ?? undefined,
      createdAt: entry.createdAt ?? new Date(),
    };
  }
}
