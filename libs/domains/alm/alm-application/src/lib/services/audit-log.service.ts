/**
 * @fileoverview Service xử lý audit log
 * @since 1.0.0
 */

import {
  AuditLogEntry,
  AuditLogQueryCriteria,
  AuditLogService as DomainAuditLogService,
} from "@ecoma/alm-domain";
import { ILogger } from "@ecoma/common-application";
import { PersistAuditLogCommand } from "../commands/persist-audit-log.command";
import { GetAuditLogsQuery } from "../queries/get-audit-logs.query";

/**
 * Service xử lý audit log
 */
export class AuditLogService {
  /**
   * Khởi tạo một instance của AuditLogService
   * @param {DomainAuditLogService} domainService - Domain service xử lý audit log
   * @param {ILogger} logger - Logger để ghi log
   */
  constructor(
    private readonly domainService: DomainAuditLogService,
    private readonly logger: ILogger
  ) {}

  /**
   * Lưu trữ một bản ghi audit log
   * @param {PersistAuditLogCommand} command - Command lưu trữ audit log
   * @returns {Promise<void>}
   */
  async persistAuditLogEntry(command: PersistAuditLogCommand): Promise<void> {
    this.logger.debug("Starting to persist audit log entry", {
      eventId: command.eventId,
      boundedContext: command.boundedContext,
      actionType: command.actionType,
    });

    try {
      const startTime = Date.now();
      
      await this.domainService.persistAuditLogEntry({
        id: command.eventId,
        eventId: command.eventId,
        timestamp: command.timestamp,
        initiator: command.initiator,
        boundedContext: command.boundedContext,
        actionType: command.actionType,
        category: command.category,
        severity: command.severity,
        entityId: command.entityId,
        entityType: command.entityType,
        tenantId: command.tenantId,
        status: command.status || "Success",
        failureReason: command.failureReason,
      });

      this.logger.info("Successfully stored audit log entry", {
        eventId: command.eventId,
        boundedContext: command.boundedContext,
        elapsedTimeMs: Date.now() - startTime,
      });
    } catch (error) {
      this.logger.error(
        "Error when storing audit log entry",
        error instanceof Error ? error : new Error(String(error)),
        {
          eventId: command.eventId,
          boundedContext: command.boundedContext,
        }
      );
      throw error;
    }
  }

  /**
   * Tìm kiếm các bản ghi audit log
   * @param {GetAuditLogsQuery} query - Query tìm kiếm audit log
   * @returns {Promise<{items: AuditLogEntry[], total: number, page: number, pageSize: number}>} Kết quả tìm kiếm
   */
  async findAuditLogs(
    query: GetAuditLogsQuery
  ): Promise<{
    items: AuditLogEntry[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { criteria } = query;
    // Extract pagination properties from the query object
    const page = (criteria as any).page || 1;
    const pageSize = (criteria as any).pageSize || 10;

    this.logger.debug("Searching for audit logs", {
      criteria: JSON.stringify(criteria),
      page,
      pageSize,
    });

    const pagination = {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    };

    // Create a specification object that matches the expected interface
    const specification = {
      getFilters: () => {
        const filters: Array<{
          field: keyof AuditLogEntry;
          operator: string;
          value: unknown;
        }> = [];

        if ((criteria as any).boundedContext) {
          filters.push({
            field: "boundedContext" as keyof AuditLogEntry,
            operator: "=",
            value: (criteria as any).boundedContext,
          });
        }

        if ((criteria as AuditLogQueryCriteria).tenantId) {
          filters.push({
            field: "tenantId" as keyof AuditLogEntry,
            operator: "=",
            value: (criteria as AuditLogQueryCriteria).tenantId,
          });
        }

        if ((criteria as AuditLogQueryCriteria).userId) {
          filters.push({
            field: "userId" as keyof AuditLogEntry,
            operator: "=",
            value: (criteria as AuditLogQueryCriteria).userId,
          });
        }

        if ((criteria as AuditLogQueryCriteria).actionType) {
          filters.push({
            field: "actionType" as keyof AuditLogEntry,
            operator: "=",
            value: (criteria as AuditLogQueryCriteria).actionType,
          });
        }

        if ((criteria as AuditLogQueryCriteria).entityId) {
          filters.push({
            field: "entityId" as keyof AuditLogEntry,
            operator: "=",
            value: (criteria as AuditLogQueryCriteria).entityId,
          });
        }

        if ((criteria as AuditLogQueryCriteria).entityType) {
          filters.push({
            field: "entityType" as keyof AuditLogEntry,
            operator: "=",
            value: (criteria as AuditLogQueryCriteria).entityType,
          });
        }

        if ((criteria as AuditLogQueryCriteria).severity) {
          filters.push({
            field: "severity" as keyof AuditLogEntry,
            operator: "=",
            value: (criteria as AuditLogQueryCriteria).severity,
          });
        }

        if (
          (criteria as AuditLogQueryCriteria).startTime ||
          (criteria as any).fromDate
        ) {
          filters.push({
            field: "timestamp" as keyof AuditLogEntry,
            operator: ">=",
            value:
              (criteria as AuditLogQueryCriteria).startTime ||
              (criteria as any).fromDate,
          });
        }

        if (
          (criteria as AuditLogQueryCriteria).endTime ||
          (criteria as any).toDate
        ) {
          filters.push({
            field: "timestamp" as keyof AuditLogEntry,
            operator: "<=",
            value:
              (criteria as AuditLogQueryCriteria).endTime ||
              (criteria as any).toDate,
          });
        }

        this.logger.debug("Search filters applied", {
          filterCount: filters.length,
          filters: JSON.stringify(filters),
        });

        return filters;
      },
      getSorts: () => {
        return [
          {
            field: "timestamp" as keyof AuditLogEntry,
            direction: "desc" as const,
          },
        ];
      },
      getLimit: () => pagination.limit,
      getOffset: () => pagination.offset,
      isSatisfiedBy: (entity: AuditLogEntry) => {
        // Basic implementation for compatibility
        let satisfies = true;

        if (
          (criteria as any).boundedContext &&
          entity.boundedContext !== (criteria as any).boundedContext
        ) {
          satisfies = false;
        }

        if (
          (criteria as AuditLogQueryCriteria).tenantId &&
          entity.tenantId !== (criteria as AuditLogQueryCriteria).tenantId
        ) {
          satisfies = false;
        }

        if (
          (criteria as AuditLogQueryCriteria).actionType &&
          entity.actionType !== (criteria as AuditLogQueryCriteria).actionType
        ) {
          satisfies = false;
        }

        // Add more conditions as needed

        return satisfies;
      },
    };

    try {
      const startTime = Date.now();
      const result = await this.domainService.findAuditLogs(
        specification,
        pagination
      );
      const elapsedTime = Date.now() - startTime;

      // Handle different result formats and ensure we always return a consistent shape
      let responseData;
      if ("total" in result) {
        // Offset pagination result
        responseData = {
          items: result.items,
          total: result.total,
          page,
          pageSize,
        };
      } else {
        // Cursor pagination result or other format
        responseData = {
          items: result.items,
          total: result.items.length,
          page,
          pageSize,
        };
      }

      this.logger.info("Successfully found audit logs", {
        totalRecords: responseData.total,
        recordCount: responseData.items.length,
        page: responseData.page,
        pageSize: responseData.pageSize,
        elapsedTimeMs: elapsedTime,
      });

      return responseData;
    } catch (error) {
      // Handle errors and return empty result
      this.logger.error(
        "Error when searching for audit logs",
        error instanceof Error ? error : new Error(String(error)),
        {
          criteria: JSON.stringify(criteria),
          page,
          pageSize,
        }
      );

      return {
        items: [],
        total: 0,
        page,
        pageSize,
      };
    }
  }
}
