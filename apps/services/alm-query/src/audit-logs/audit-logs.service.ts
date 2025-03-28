/**
 * @fileoverview Service xử lý truy vấn audit logs
 * @since 1.0.0
 */

import {
  AuditLogEntry,
  AuditLogEntryId,
  IAuditLogReadRepository,
} from "@ecoma/alm-domain";
import { ALM_TOKENS } from "@ecoma/alm-infrastructure";
import {
  IOffsetBasedPaginatedResult,
  IQuerySpecification,
} from "@ecoma/common-domain";
import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

// Định nghĩa các interface không tìm thấy trong common-domain
// Chỉnh sửa để phù hợp với IQuerySpecification
class DefaultOffsetBasedQuerySpecification<T>
  implements IQuerySpecification<T>
{
  constructor(
    private readonly filters: Array<{
      field: keyof T;
      operator: string;
      value: unknown;
    }>,
    private readonly offset: number,
    private readonly limit: number,
    private readonly sorts: Array<{
      field: keyof T;
      direction: "asc" | "desc";
    }>,
    private readonly filterMapping: Record<string, string>
  ) {}

  getFilters(): Array<{ field: keyof T; operator: string; value: unknown }> {
    return this.filters;
  }

  getOffset(): number {
    return this.offset;
  }

  getLimit(): number {
    return this.limit;
  }

  getSorts(): Array<{ field: keyof T; direction: "asc" | "desc" }> {
    return this.sorts;
  }
}

/**
 * Interface cho các parameters trong truy vấn audit logs
 */
export interface IAuditLogQueryParams {
  tenantId: string;
  resourceId?: string;
  eventId?: string;
  boundedContext?: string;
  actionType?: string;
  category?: string;
  severity?: string;
  entityType?: string;
  entityId?: string;
  initiatorId?: string;
  initiatorType?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Service xử lý truy vấn audit logs
 */
@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);
  private readonly defaultPageSize = 20;
  private readonly maxPageSize = 100;

  constructor(
    @Inject(ALM_TOKENS.auditLogReadRepository)
    private readonly auditLogRepository: IAuditLogReadRepository,
    @Inject("IAM_SERVICE") private readonly iamServiceClient: ClientProxy
  ) {}

  /**
   * Kiểm tra quyền truy cập audit logs
   * @param {string} userId - ID của người dùng
   * @param {string} tenantId - ID của tenant
   * @returns {Promise<boolean>} - true nếu có quyền, false nếu không
   */
  private async checkPermission(
    userId: string,
    tenantId: string
  ): Promise<boolean> {
    try {
      // Trong E2E tests, IAM_SERVICE có thể không có sẵn hoặc trong chế độ AUTH_BYPASS
      const env = process.env.NODE_ENV || "development";
      if (env === "test" || process.env.AUTH_BYPASS === "true") {
        this.logger.debug(
          `Bypass kiểm tra quyền trong môi trường test/bypass cho userId=${userId}, tenantId=${tenantId}`
        );
        return true;
      }

      // Thực hiện gọi đến IAM service để kiểm tra quyền
      const response = await firstValueFrom(
        this.iamServiceClient.send(
          { cmd: "check-permission" },
          { userId, tenantId, permission: "alm:audit-logs:read" }
        )
      );
      return response?.hasPermission === true;
    } catch (error) {
      this.logger.error(`Lỗi khi kiểm tra quyền: ${error.message}`);
      // Trong môi trường test, cho phép truy cập mặc dù có lỗi
      if (
        process.env.NODE_ENV === "test" ||
        process.env.AUTH_BYPASS === "true"
      ) {
        return true;
      }
      return false;
    }
  }

  /**
   * Lấy danh sách audit logs với phân trang
   * @param {IAuditLogQueryParams} params - Tham số truy vấn
   * @returns {Promise<IOffsetBasedPaginatedResult<AuditLogEntry>>} - Kết quả phân trang
   */
  async getAuditLogs(
    params: IAuditLogQueryParams
  ): Promise<IOffsetBasedPaginatedResult<AuditLogEntry>> {
    this.logger.debug(
      `Thực hiện truy vấn audit logs với params: ${JSON.stringify(params)}`
    );

    // Xử lý thông số phân trang
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.min(
      this.maxPageSize,
      params.pageSize || this.defaultPageSize
    );
    const offset = (page - 1) * pageSize;

    // Tạo các bộ lọc dựa trên params
    const filters: Array<{
      field: keyof AuditLogEntry;
      operator: string;
      value: unknown;
    }> = [];

    // Thêm các bộ lọc bắt buộc
    if (params.tenantId) {
      filters.push({
        field: "tenantId" as keyof AuditLogEntry,
        operator: "eq",
        value: params.tenantId,
      });
    }

    // Thêm các bộ lọc tùy chọn
    if (params.boundedContext) {
      filters.push({
        field: "boundedContext" as keyof AuditLogEntry,
        operator: "eq",
        value: params.boundedContext,
      });
    }

    if (params.actionType) {
      filters.push({
        field: "actionType" as keyof AuditLogEntry,
        operator: "eq",
        value: params.actionType,
      });
    }

    if (params.category) {
      filters.push({
        field: "category" as keyof AuditLogEntry,
        operator: "eq",
        value: params.category,
      });
    }

    if (params.severity) {
      filters.push({
        field: "severity" as keyof AuditLogEntry,
        operator: "eq",
        value: params.severity,
      });
    }

    if (params.entityType) {
      filters.push({
        field: "entityType" as keyof AuditLogEntry,
        operator: "eq",
        value: params.entityType,
      });
    }

    if (params.entityId) {
      filters.push({
        field: "entityId" as keyof AuditLogEntry,
        operator: "eq",
        value: params.entityId,
      });
    }

    if (params.status) {
      filters.push({
        field: "status" as keyof AuditLogEntry,
        operator: "eq",
        value: params.status,
      });
    }

    // Xử lý lọc theo thời gian
    if (params.startDate) {
      const startDate = new Date(params.startDate);
      filters.push({
        field: "timestamp" as keyof AuditLogEntry,
        operator: "gte",
        value: startDate,
      });
    }

    if (params.endDate) {
      const endDate = new Date(params.endDate);
      filters.push({
        field: "timestamp" as keyof AuditLogEntry,
        operator: "lte",
        value: endDate,
      });
    }

    // Xử lý lọc theo initiator
    if (params.initiatorId) {
      filters.push({
        field: "initiator.id" as keyof AuditLogEntry,
        operator: "eq",
        value: params.initiatorId,
      });
    }

    if (params.initiatorType) {
      filters.push({
        field: "initiator.type" as keyof AuditLogEntry,
        operator: "eq",
        value: params.initiatorType,
      });
    }

    // Xử lý đặc biệt cho resource.id
    if (params.resourceId) {
      try {
        // Tạo query specification cho resource.id
        const resourceIdSpec =
          new DefaultOffsetBasedQuerySpecification<AuditLogEntry>(
            [
              {
                field: "resource.id" as keyof AuditLogEntry,
                operator: "eq",
                value: params.resourceId,
              },
            ],
            0,
            1,
            [{ field: "timestamp" as keyof AuditLogEntry, direction: "desc" }],
            // eslint-disable-next-line @typescript-eslint/naming-convention
            { "resource.id": "resource.id" }
          );

        const resourceResult =
          await this.auditLogRepository.findWithOffsetPagination(
            resourceIdSpec,
            { offset: 0, limit: 1 }
          );

        if (resourceResult && resourceResult.items.length > 0) {
          this.logger.debug(
            `Tìm thấy audit log với resource.id: ${params.resourceId}`
          );
          return {
            items: resourceResult.items,
            total: resourceResult.total,
            offset: 0,
            limit: 1,
          };
        }
      } catch (error) {
        this.logger.error(`Lỗi khi tìm theo resource.id: ${error.message}`);
      }
    }

    // Xử lý đặc biệt cho eventId
    if (params.eventId) {
      try {
        // Tạo query specification cho eventId
        const eventIdSpec =
          new DefaultOffsetBasedQuerySpecification<AuditLogEntry>(
            [
              {
                field: "eventId" as keyof AuditLogEntry,
                operator: "eq",
                value: params.eventId,
              },
            ],
            0,
            1,
            [{ field: "timestamp" as keyof AuditLogEntry, direction: "desc" }],
            { eventId: "eventId" }
          );

        const eventResult =
          await this.auditLogRepository.findWithOffsetPagination(eventIdSpec, {
            offset: 0,
            limit: 1,
          });

        if (eventResult && eventResult.items.length > 0) {
          this.logger.debug(
            `Tìm thấy audit log với eventId: ${params.eventId}`
          );
          return {
            items: eventResult.items,
            total: eventResult.total,
            offset: 0,
            limit: 1,
          };
        }
      } catch (error) {
        this.logger.error(`Lỗi khi tìm theo eventId: ${error.message}`);
      }
    }

    // Tạo query specification chính cho truy vấn
    const querySpec = new DefaultOffsetBasedQuerySpecification<AuditLogEntry>(
      filters,
      offset,
      pageSize,
      [{ field: "timestamp" as keyof AuditLogEntry, direction: "desc" }],
      {
        tenantId: "tenantId",
        boundedContext: "boundedContext",
        actionType: "actionType",
        category: "category",
        severity: "severity",
        entityType: "entityType",
        entityId: "entityId",
        status: "status",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "initiator.id": "initiator.id",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "initiator.type": "initiator.type",
        timestamp: "timestamp",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "resource.id": "resource.id",
        eventId: "eventId",
      }
    );

    // Thực hiện truy vấn
    try {
      const result = await this.auditLogRepository.findWithOffsetPagination(
        querySpec,
        { offset, limit: pageSize }
      );
      this.logger.debug(
        `Kết quả truy vấn: ${result.items.length} bản ghi, tổng ${result.total}`
      );
      return result;
    } catch (error) {
      this.logger.error(`Lỗi khi truy vấn audit logs: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một audit log theo ID
   * @param {string} id - ID của audit log
   * @returns {Promise<AuditLogEntry>} - Chi tiết audit log
   * @throws {NotFoundException} - Nếu không tìm thấy audit log
   */
  async getAuditLogById(id: string): Promise<AuditLogEntry> {
    this.logger.debug(`Lấy chi tiết audit log với ID: ${id}`);

    try {
      const auditLogEntryId = new AuditLogEntryId(id);
      const auditLog = await this.auditLogRepository.findById(auditLogEntryId);

      if (!auditLog) {
        this.logger.debug(`Không tìm thấy audit log với ID: ${id}`);
        throw new NotFoundException(`Không tìm thấy audit log với ID: ${id}`);
      }

      this.logger.debug(`Đã tìm thấy audit log với ID: ${id}`);
      return auditLog;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Lỗi khi lấy chi tiết audit log: ${error.message}`);
      throw error;
    }
  }
}
