import { IGenericResult, IQueryHandler } from "@ecoma/common-application";
import { ILogger, IOffsetBasedPaginatedResult } from "@ecoma/common-domain";
import "reflect-metadata";

import { GetAuditLogsQueryDto } from "../../dtos/queries/get-audit-logs.query.dto";
import { IAuditLogEntryReadRepo } from "../../ports/repository";
import { GetAuditLogsQuery } from "./get-audit-logs.query";
import { GetAuditLogsQueryHandler } from "./get-audit-logs.query.handler";

type GetAuditLogsResult = IGenericResult<
  IOffsetBasedPaginatedResult<any>,
  string
>;

// Mock the repository and validation
jest.mock("class-validator", () => ({
  validateSync: jest.fn().mockReturnValue([]), // No validation errors
}));

describe("GetAuditLogsQueryHandler", () => {
  let handler: IQueryHandler<GetAuditLogsQuery, GetAuditLogsResult>;
  let auditLogRepo: IAuditLogEntryReadRepo;
  let logger: ILogger;
  let validateSyncMock: jest.Mock;

  beforeEach(() => {
    // Get the mocked validateSync function
    validateSyncMock = require("class-validator").validateSync;
    validateSyncMock.mockReturnValue([]); // Reset to no validation errors by default

    // Create mock repo with jest.fn()
    auditLogRepo = {
      findByCriteria: jest.fn().mockResolvedValue({ data: [], total: 0 }),
      findById: jest.fn(),
      find: jest.fn(),
      findWithOffsetPagination: jest.fn(),
      findWithCursorPagination: jest.fn(),
    };

    // Create mock logger with jest.fn()
    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };

    handler = new GetAuditLogsQueryHandler(auditLogRepo, logger);
  });

  it("Trả về thành công khi repo trả về dữ liệu", async () => {
    // Return a mock object with any type
    const mockReturnValue = {
      data: [{ id: "1" }] as any[],
      total: 1,
    };

    (auditLogRepo.findByCriteria as jest.Mock).mockResolvedValue(
      mockReturnValue
    );

    const queryDto: GetAuditLogsQueryDto = {
      pageNumber: 0,
      pageSize: 10,
    } as any;
    const query = new GetAuditLogsQuery(queryDto);
    const result = await handler.handle(query);
    expect(result.success).toBe(true);
    expect(result.data.items.length).toBe(1);
    expect(result.data.total).toBe(1);
    expect(result.data.offset).toBe(0);
    expect(result.data.limit).toBe(10);
  });

  it("Trả về lỗi khi validate lỗi", async () => {
    // Set up validation to fail
    validateSyncMock.mockReturnValue([
      {
        constraints: { isNotEmpty: "should not be empty" },
      },
    ]);

    const queryDto: GetAuditLogsQueryDto = {
      pageNumber: 0,
      pageSize: 10,
    } as any;
    const query = new GetAuditLogsQuery(queryDto);
    const result = await handler.handle(query);
    expect(result.success).toBe(false);
    expect(result.error).toBe("INVALID_PAYLOAD");
    expect(result.data.items).toEqual([]);
    expect(result.data.total).toBe(0);
    expect(result.data.offset).toBe(0);
    expect(result.data.limit).toBe(10);
  });

  it("Trả về lỗi khi repo throw", async () => {
    // Ensure validation passes but repo throws
    validateSyncMock.mockReturnValue([]);
    (auditLogRepo.findByCriteria as jest.Mock).mockRejectedValue(
      new Error("DB error")
    );

    const queryDto: GetAuditLogsQueryDto = {
      pageNumber: 0,
      pageSize: 10,
    } as any;
    const query = new GetAuditLogsQuery(queryDto);
    const result = await handler.handle(query);
    expect(result.success).toBe(false);
    expect(result.error).toBe("GET_AUDIT_LOGS_FAILED");
    expect(result.data.items).toEqual([]);
    expect(result.data.total).toBe(0);
    expect(result.data.offset).toBe(0);
    expect(result.data.limit).toBe(10);
  });
});
