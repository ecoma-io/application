import { IGenericResult, IQueryHandler } from "@ecoma/common-application";
import { ILogger, IOffsetBasedPaginatedResult } from "@ecoma/common-domain";
import "reflect-metadata";

import { UnauthorizedError } from "../errors";
import { IAuditLogQueryAuthorizationPolicy } from "../policies";
import { IAuditLogEntryReadRepo } from "../ports/repository";
import { GetAuditLogsQuery } from "../use-cases/queries/get-audit-logs.query";
import { AuditLogQueryApplicationService } from "./audit-log-query-application.service";

describe("AuditLogQueryApplicationService", () => {
  let service: AuditLogQueryApplicationService;
  let auditLogRepo: jest.Mocked<IAuditLogEntryReadRepo>;
  let logger: jest.Mocked<ILogger>;
  let authorizationPolicy: jest.Mocked<IAuditLogQueryAuthorizationPolicy>;
  let queryHandler: jest.Mocked<
    IQueryHandler<
      GetAuditLogsQuery,
      IGenericResult<IOffsetBasedPaginatedResult<any>, string>
    >
  >;

  beforeEach(() => {
    auditLogRepo = {
      findByCriteria: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      findWithOffsetPagination: jest.fn(),
      findWithCursorPagination: jest.fn(),
    };

    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };

    authorizationPolicy = {
      canQueryAuditLogs: jest.fn().mockResolvedValue(true),
    } as any;

    queryHandler = {
      handle: jest.fn().mockResolvedValue({
        success: true,
        error: "",
        details: "",
        data: {
          items: [],
          total: 0,
          offset: 0,
          limit: 10,
        },
      }),
    };

    service = new AuditLogQueryApplicationService(
      auditLogRepo,
      logger,
      authorizationPolicy,
      queryHandler
    );
  });

  it("Truy vấn thành công với quyền hợp lệ", async () => {
    const user = {
      id: "user1",
      roles: ["admin"],
      tenantId: "tenant1",
    };
    const query = new GetAuditLogsQuery({
      pageNumber: 0,
      pageSize: 10,
    });

    const result = await service.getAuditLogs(user, query);

    expect(result.success).toBe(true);
    expect(result.data.items).toEqual([]);
    expect(result.data.total).toBe(0);
    expect(authorizationPolicy.canQueryAuditLogs).toHaveBeenCalledWith(
      user,
      query.payload
    );
    expect(queryHandler.handle).toHaveBeenCalledWith(query);
  });

  it("Truy vấn thất bại với quyền không hợp lệ", async () => {
    const user = {
      id: "user1",
      roles: ["user"],
      tenantId: "tenant1",
    };
    const query = new GetAuditLogsQuery({
      pageNumber: 0,
      pageSize: 10,
    });

    authorizationPolicy.canQueryAuditLogs.mockResolvedValue(false);

    await expect(service.getAuditLogs(user, query)).rejects.toThrow(
      UnauthorizedError
    );
    expect(authorizationPolicy.canQueryAuditLogs).toHaveBeenCalledWith(
      user,
      query.payload
    );
    expect(queryHandler.handle).not.toHaveBeenCalled();
  });
});
