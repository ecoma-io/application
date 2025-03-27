import { ILogger } from "@ecoma/common-domain";
import "reflect-metadata";

import { GetAuditLogsQueryDto } from "../../dtos/queries/get-audit-logs.query.dto";
import { IAuditLogEntryReadRepo } from "../../ports/repository";
import { GetAuditLogsQuery } from "./get-audit-logs.query";
import { GetAuditLogsQueryHandler } from "./get-audit-logs.query.handler";

// Mock the repository and validation
jest.mock("class-validator", () => ({
  validateSync: jest.fn().mockReturnValue([]), // No validation errors
}));

const mockLogger: ILogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
};

describe("GetAuditLogsQueryHandler", () => {
  let handler: GetAuditLogsQueryHandler;
  let repo: jest.Mocked<IAuditLogEntryReadRepo>;
  let validateSyncMock: jest.Mock;

  beforeEach(() => {
    // Get the mocked validateSync function
    validateSyncMock = require("class-validator").validateSync;
    validateSyncMock.mockReturnValue([]); // Reset to no validation errors by default

    // Create mock repo
    repo = {
      findByCriteria: jest
        .fn()
        .mockImplementation(() => ({ data: [], total: 0 })),
    } as any;

    handler = new GetAuditLogsQueryHandler(repo, mockLogger);
  });

  it("Trả về thành công khi repo trả về dữ liệu", async () => {
    // Return a mock object with any type
    const mockReturnValue = {
      data: [{ id: "1" }] as any[],
      total: 1,
    };

    repo.findByCriteria.mockResolvedValue(mockReturnValue);

    const queryDto: GetAuditLogsQueryDto = {
      pageNumber: 1,
      pageSize: 10,
    } as any;
    const query = new GetAuditLogsQuery(queryDto);
    const result = await handler.execute(query);
    expect(result.success).toBe(true);
    expect(result.data.data.length).toBe(1);
    expect(result.data.total).toBe(1);
  });

  it("Trả về lỗi khi validate lỗi", async () => {
    // Set up validation to fail
    validateSyncMock.mockReturnValue([
      {
        constraints: { isNotEmpty: "should not be empty" },
      },
    ]);

    const queryDto: any = { pageNumber: undefined, pageSize: undefined };
    const query = new GetAuditLogsQuery(queryDto);
    const result = await handler.execute(query);
    expect(result.success).toBe(false);
    expect(result.error).toBe("INVALID_PAYLOAD");
  });

  it("Trả về lỗi khi repo throw", async () => {
    // Ensure validation passes but repo throws
    validateSyncMock.mockReturnValue([]);
    repo.findByCriteria.mockRejectedValue(new Error("DB error"));

    const queryDto: GetAuditLogsQueryDto = {
      pageNumber: 1,
      pageSize: 10,
    } as any;
    const query = new GetAuditLogsQuery(queryDto);
    const result = await handler.execute(query);
    expect(result.success).toBe(false);
    expect(result.error).toBe("GET_AUDIT_LOGS_FAILED");
  });
});
