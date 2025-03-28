/**
 * @fileoverview Unit tests cho AuditLogService
 */

import {
  AuditContext,
  AuditLogEntry,
  AuditLogEntryId,
  AuditLogService as DomainAuditLogService,
  Initiator,
} from "@ecoma/alm-domain";
import { ILogger } from "@ecoma/common-application";
import { IOffsetBasedPaginatedResult } from "@ecoma/common-domain";
import { PersistAuditLogCommand } from "../commands/persist-audit-log.command";
import { GetAuditLogsQuery } from "../queries/get-audit-logs.query";
import { AuditLogService } from "./audit-log.service";

// Type mở rộng cho test
interface ITestAuditLogQueryCriteria {
  tenantId?: string;
  startTime?: Date;
  endTime?: Date;
  page?: number;
  pageSize?: number;
}

describe("AuditLogService", () => {
  // Mocks
  const mockDomainService = {
    persistAuditLogEntry: jest.fn().mockResolvedValue(undefined),
    findAuditLogs: jest.fn().mockResolvedValue({
      items: [],
      total: 0,
      offset: 0,
      limit: 10,
    } as IOffsetBasedPaginatedResult<AuditLogEntry>),
  } as unknown as jest.Mocked<DomainAuditLogService>;

  const mockLogger: jest.Mocked<ILogger> = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  };

  let service: AuditLogService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuditLogService(mockDomainService, mockLogger);
  });

  describe("persistAuditLogEntry", () => {
    it("nên gọi domain service với các tham số đúng", async () => {
      // Arrange
      const command = new PersistAuditLogCommand(
        "test-event-id",
        new Date(),
        Initiator.create({
          type: "User",
          id: "test-user",
          name: "Test User",
        }),
        "TestBC",
        "TestAction",
        "test-tenant",
        "Test",
        "Low",
        "test-entity",
        "TestEntity",
        "Test description",
        "Success"
      );

      // Act
      await service.persistAuditLogEntry(command);

      // Assert
      expect(mockDomainService.persistAuditLogEntry).toHaveBeenCalledTimes(1);
      expect(mockDomainService.persistAuditLogEntry).toHaveBeenCalledWith(
        expect.objectContaining({
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
          status: command.status,
        })
      );

      // Logger verification
      expect(mockLogger.debug).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          eventId: command.eventId,
          boundedContext: command.boundedContext,
          actionType: command.actionType,
        })
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          eventId: command.eventId,
          boundedContext: command.boundedContext,
        })
      );
    });

    it("nên ghi log lỗi khi domain service ném ra lỗi", async () => {
      // Arrange
      const command = new PersistAuditLogCommand(
        "test-event-id",
        new Date(),
        Initiator.create({
          type: "User",
          id: "test-user",
          name: "Test User",
        }),
        "TestBC",
        "TestAction",
        "test-tenant",
        "Test",
        "Low",
        "test-entity",
        "TestEntity",
        "Test description",
        "Success"
      );

      const testError = new Error("Test error");
      mockDomainService.persistAuditLogEntry.mockRejectedValueOnce(testError);

      // Act & Assert
      await expect(service.persistAuditLogEntry(command)).rejects.toThrow(
        testError
      );

      // Logger verification
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.any(String),
        testError,
        expect.objectContaining({
          eventId: command.eventId,
          boundedContext: command.boundedContext,
        })
      );
    });
  });

  describe("findAuditLogs", () => {
    it("nên tạo specification và pagination từ query criteria", async () => {
      // Arrange
      const query = new GetAuditLogsQuery(
        {
          tenantId: "test-tenant",
          startTime: new Date("2023-01-01T00:00:00Z"),
          endTime: new Date("2023-01-31T23:59:59Z"),
          page: 2,
          pageSize: 20,
        } as ITestAuditLogQueryCriteria,
        {
          timestamp: new Date(),
          version: "1.0",
        }
      );

      // Mock domain service response
      const mockAuditLogEntry = new AuditLogEntry({
        id: new AuditLogEntryId("123e4567-e89b-12d3-a456-426614174000"),
        timestamp: new Date(),
        initiator: Initiator.create({
          type: "User",
          id: "test-user",
          name: "Test User",
        }),
        boundedContext: "TestBC",
        actionType: "TestAction",
        status: "Success",
        contextData: AuditContext.create({
          boundedContext: "TestBC",
          tenantId: "test-tenant",
          userId: "test-user",
          actionType: "TestAction",
          entityType: "TestEntity",
          entityId: "test-entity",
          timestamp: new Date(),
        }),
      });

      const mockResult: IOffsetBasedPaginatedResult<AuditLogEntry> = {
        items: [mockAuditLogEntry],
        total: 1,
        offset: 20,
        limit: 20,
      };

      mockDomainService.findAuditLogs.mockResolvedValueOnce(mockResult);

      // Act
      const result = await service.findAuditLogs(query);

      // Assert
      expect(mockDomainService.findAuditLogs).toHaveBeenCalledTimes(1);
      expect(mockDomainService.findAuditLogs).toHaveBeenCalledWith(
        expect.any(Object), // Specification
        expect.objectContaining({
          offset: 20, // (page - 1) * pageSize = (2 - 1) * 20 = 20
          limit: 20,
        })
      );

      expect(result).toEqual({
        items: [mockAuditLogEntry],
        total: 1,
        page: 2,
        pageSize: 20,
      });

      // Logger verification
      expect(mockLogger.debug).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          criteria: expect.any(String),
          page: 2,
          pageSize: 20,
        })
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          totalRecords: 1,
          recordCount: 1,
          page: 2,
          pageSize: 20,
          elapsedTimeMs: expect.any(Number),
        })
      );
    });

    it("nên xử lý lỗi và trả về kết quả rỗng khi domain service ném ra lỗi", async () => {
      // Arrange
      const query = new GetAuditLogsQuery(
        {
          tenantId: "test-tenant",
          page: 1,
          pageSize: 10,
        } as ITestAuditLogQueryCriteria,
        {
          timestamp: new Date(),
          version: "1.0",
        }
      );

      const testError = new Error("Test error");
      mockDomainService.findAuditLogs.mockRejectedValueOnce(testError);

      // Act
      const result = await service.findAuditLogs(query);

      // Assert
      expect(result).toEqual({
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
      });

      // Logger verification
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.any(String),
        testError,
        expect.objectContaining({
          criteria: expect.any(String),
          page: 1,
          pageSize: 10,
        })
      );
    });
  });
});
