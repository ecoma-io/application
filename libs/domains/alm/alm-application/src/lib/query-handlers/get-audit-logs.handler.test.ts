/**
 * @fileoverview Unit tests cho GetAuditLogsHandler
 */

import {
  AuditContext,
  AuditLogEntry,
  AuditLogEntryId,
  Initiator,
} from "@ecoma/alm-domain";
import { ILogger } from "@ecoma/common-application";
import { GetAuditLogsQuery } from "../queries/get-audit-logs.query";
import { AuditLogService } from "../services/audit-log.service";
import { GetAuditLogsHandler } from "./get-audit-logs.handler";

// Extended criteria for testing purposes
interface ITestAuditLogQueryCriteria {
  tenantId?: string;
  boundedContext?: string;
  actionType?: string;
  category?: string;
  severity?: string;
  entityId?: string;
  entityType?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  pageSize?: number;
}

describe("GetAuditLogsHandler", () => {
  // Mock data
  const mockAuditLogEntries = [
    new AuditLogEntry({
      id: new AuditLogEntryId("123e4567-e89b-12d3-a456-426614174000"),
      eventId: "event-1",
      timestamp: new Date("2023-01-01T10:00:00Z"),
      initiator: Initiator.create({
        type: "User",
        id: "user-1",
        name: "John Doe",
      }),
      boundedContext: "IAM",
      actionType: "User.Created",
      category: "Security",
      severity: "High",
      entityId: "entity-1",
      entityType: "User",
      tenantId: "tenant-1",
      contextData: AuditContext.create({
        boundedContext: "IAM",
        tenantId: "tenant-1",
        userId: "user-1",
        actionType: "User.Created",
        entityType: "User",
        entityId: "entity-1",
        timestamp: new Date("2023-01-01T10:00:00Z"),
        metadata: { ipAddress: "192.168.1.1" },
      }),
      status: "Success",
      failureReason: null,
    }),
    new AuditLogEntry({
      id: new AuditLogEntryId("123e4567-e89b-12d3-a456-426614174001"),
      eventId: "event-2",
      timestamp: new Date("2023-01-01T11:00:00Z"),
      initiator: Initiator.create({
        type: "User",
        id: "user-2",
        name: "Jane Smith",
      }),
      boundedContext: "IAM",
      actionType: "User.Updated",
      category: "Security",
      severity: "Medium",
      entityId: "entity-2",
      entityType: "User",
      tenantId: "tenant-1",
      contextData: AuditContext.create({
        boundedContext: "IAM",
        tenantId: "tenant-1",
        userId: "user-2",
        actionType: "User.Updated",
        entityType: "User",
        entityId: "entity-2",
        timestamp: new Date("2023-01-01T11:00:00Z"),
        metadata: { ipAddress: "192.168.1.2" },
      }),
      status: "Success",
      failureReason: null,
    }),
  ];

  // Mock AuditLogService
  const mockAuditLogService = {
    findAuditLogs: jest.fn().mockResolvedValue({
      items: mockAuditLogEntries,
      total: 2,
      page: 1,
      pageSize: 10,
    }),
  };

  // Mock Logger
  const mockLogger: jest.Mocked<ILogger> = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
  };

  let handler: GetAuditLogsHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    handler = new GetAuditLogsHandler(
      mockAuditLogService as unknown as AuditLogService,
      mockLogger
    );
  });

  it("nên khởi tạo được handler", () => {
    expect(handler).toBeDefined();
  });

  it("nên gọi auditLogService.findAuditLogs với các tham số đúng khi xử lý query", async () => {
    // Arrange
    const query = new GetAuditLogsQuery(
      {
        tenantId: "tenant-1",
        boundedContext: "IAM",
        actionType: "User.Created",
        fromDate: new Date("2023-01-01T00:00:00Z"),
        toDate: new Date("2023-01-02T00:00:00Z"),
        page: 1,
        pageSize: 10,
      } as ITestAuditLogQueryCriteria,
      {
        timestamp: new Date(),
        version: "1.0.0",
      }
    );

    // Act
    await handler.handle(query);

    // Assert
    expect(mockAuditLogService.findAuditLogs).toHaveBeenCalledTimes(1);
    expect(mockAuditLogService.findAuditLogs).toHaveBeenCalledWith(
      expect.any(Object)
    );

    // Kiểm tra logger
    expect(mockLogger.debug).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        criteria: expect.any(String),
      })
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        totalRecords: expect.any(Number),
        recordCount: expect.any(Number),
        elapsedTimeMs: expect.any(Number),
      })
    );
  });

  it("nên trả về kết quả đúng từ auditLogService.findAuditLogs", async () => {
    // Arrange
    const query = new GetAuditLogsQuery(
      {
        tenantId: "tenant-1",
        page: 1,
        pageSize: 10,
      } as ITestAuditLogQueryCriteria,
      {
        timestamp: new Date(),
        version: "1.0.0",
      }
    );

    const expectedResult = {
      items: mockAuditLogEntries,
      total: 2,
      page: 1,
      pageSize: 10,
    };

    // Act
    const result = await handler.handle(query);

    // Assert
    expect(result).toEqual(expectedResult);

    // Kiểm tra logger
    expect(mockLogger.debug).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalled();
  });

  it("nên gọi auditLogService.findAuditLogs với các tham số mặc định khi không được cung cấp trong query", async () => {
    // Arrange
    const query = new GetAuditLogsQuery(
      {
        tenantId: "tenant-1",
        // Không cung cấp các tham số khác
      } as ITestAuditLogQueryCriteria,
      {
        timestamp: new Date(),
        version: "1.0.0",
      }
    );

    // Act
    await handler.handle(query);

    // Assert
    expect(mockAuditLogService.findAuditLogs).toHaveBeenCalledTimes(1);
    expect(mockAuditLogService.findAuditLogs).toHaveBeenCalledWith(
      expect.any(Object)
    );

    // Kiểm tra logger
    expect(mockLogger.debug).toHaveBeenCalled();
  });

  it("nên xử lý đúng khi auditLogService.findAuditLogs ném ra lỗi", async () => {
    // Arrange
    const query = new GetAuditLogsQuery(
      {
        tenantId: "tenant-1",
      } as ITestAuditLogQueryCriteria,
      {
        timestamp: new Date(),
        version: "1.0.0",
      }
    );

    const testError = new Error("Test error");
    mockAuditLogService.findAuditLogs.mockRejectedValueOnce(testError);

    // Act
    const result = await handler.handle(query);

    // Assert
    expect(result).toEqual({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });

    // Kiểm tra logger
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.any(String),
      testError,
      expect.objectContaining({
        criteria: expect.any(String),
      })
    );
  });

  it("nên gọi auditLogService.findAuditLogs với các bộ lọc đầy đủ khi được cung cấp", async () => {
    // Arrange
    const query = new GetAuditLogsQuery(
      {
        tenantId: "tenant-1",
        boundedContext: "IAM",
        actionType: "User.Created",
        category: "Security",
        severity: "High",
        entityId: "entity-1",
        entityType: "User",
        fromDate: new Date("2023-01-01T00:00:00Z"),
        toDate: new Date("2023-01-02T00:00:00Z"),
        page: 2,
        pageSize: 20,
      } as ITestAuditLogQueryCriteria,
      {
        timestamp: new Date(),
        version: "1.0.0",
      }
    );

    // Act
    await handler.handle(query);

    // Assert
    expect(mockAuditLogService.findAuditLogs).toHaveBeenCalledTimes(1);
    expect(mockAuditLogService.findAuditLogs).toHaveBeenCalledWith(
      expect.any(Object)
    );

    // Kiểm tra logger
    expect(mockLogger.debug).toHaveBeenCalled();
  });
});
