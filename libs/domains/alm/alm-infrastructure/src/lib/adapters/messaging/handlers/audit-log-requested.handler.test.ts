import {
  AuditLogIngestionApplicationService,
  AuditLogQueryApplicationService,
  AuditLogStatus,
  GetAuditLogsQuery,
} from "@ecoma/alm-application";
import { InitiatorType } from "@ecoma/alm-domain";
import { AuditLogRequestedEvent } from "@ecoma/alm-events";
import { ILogger } from "@ecoma/common-domain";
import { Test } from "@nestjs/testing";
import { v7 as uuidv7 } from "uuid";

import { AuditLogEventMapper } from "../mappers/audit-log-event.mapper";
import { AuditLogRequestedHandler } from "./audit-log-requested.handler";

describe("AuditLogRequestedHandler", () => {
  let handler: AuditLogRequestedHandler;
  let mockMapper: jest.Mocked<AuditLogEventMapper>;
  let mockService: jest.Mocked<AuditLogIngestionApplicationService>;
  let queryService: jest.Mocked<AuditLogQueryApplicationService>;
  let logger: jest.Mocked<ILogger>;

  beforeEach(async () => {
    mockMapper = {
      toDto: jest.fn(),
    } as any;

    mockService = {
      handleAuditLogRequestedEvent: jest.fn().mockResolvedValue(undefined),
    } as any;

    queryService = {
      getAuditLogs: jest.fn().mockResolvedValue({
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
    } as any;

    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuditLogRequestedHandler,
        {
          provide: AuditLogIngestionApplicationService,
          useValue: mockService,
        },
        {
          provide: AuditLogQueryApplicationService,
          useValue: queryService,
        },
        {
          provide: AuditLogEventMapper,
          useValue: mockMapper,
        },
        {
          provide: "ILogger",
          useValue: logger,
        },
      ],
    }).compile();

    handler = moduleRef.get<AuditLogRequestedHandler>(AuditLogRequestedHandler);
  });

  it("Nên xử lý được sự kiện AuditLogRequestedEvent", async () => {
    const timestamp = new Date();
    const event = {
      timestamp,
      initiator: {
        type: InitiatorType.User,
        id: "user1",
        name: "Test User",
      },
      boundedContext: "test",
      actionType: "CREATE",
      category: "USER",
      severity: "INFO",
      entityId: "123",
      entityType: "User",
      tenantId: "tenant1",
      contextData: { key: "value" },
      status: "Success",
      eventId: uuidv7(),
      issuedAt: new Date(),
    } as AuditLogRequestedEvent;

    const dto = {
      timestamp: timestamp.toISOString(),
      initiator: {
        type: InitiatorType.User,
        id: "user1",
        name: "Test User",
      },
      boundedContext: "test",
      actionType: "CREATE",
      category: "USER",
      severity: "INFO",
      entityId: "123",
      entityType: "User",
      tenantId: "tenant1",
      contextData: { value: { key: "value" } },
      status: AuditLogStatus.Success,
    };

    mockMapper.toDto.mockReturnValue(dto);

    await handler.handle(event);

    expect(mockMapper.toDto).toHaveBeenCalledWith(event);
    expect(mockService.handleAuditLogRequestedEvent).toHaveBeenCalledWith(dto);
    expect(logger.info).not.toHaveBeenCalled();
  });

  it("Xử lý yêu cầu truy vấn audit log thành công", async () => {
    const timestamp = new Date();
    const issuedAt = new Date();
    const event: AuditLogRequestedEvent = {
      timestamp,
      initiator: {
        type: "User",
        id: "user1",
        name: "Test User",
      },
      boundedContext: "alm",
      actionType: "AuditLog.Requested",
      entityType: "AuditLog",
      entityId: "query1",
      contextData: {
        userId: "user1",
        roles: ["admin"],
        tenantId: "tenant1",
        pageNumber: 0,
        pageSize: 10,
      },
      status: "Success",
      issuedAt,
    };

    await handler.handle(event);

    expect(queryService.getAuditLogs).toHaveBeenCalledWith(
      {
        id: "user1",
        roles: ["admin"],
        tenantId: "tenant1",
      },
      expect.any(GetAuditLogsQuery)
    );
    expect(logger.info).toHaveBeenCalledTimes(2);
  });

  it("Xử lý lỗi khi truy vấn thất bại", async () => {
    const timestamp = new Date();
    const issuedAt = new Date();
    const event: AuditLogRequestedEvent = {
      timestamp,
      initiator: {
        type: "User",
        id: "user1",
        name: "Test User",
      },
      boundedContext: "alm",
      actionType: "AuditLog.Requested",
      entityType: "AuditLog",
      entityId: "query1",
      contextData: {
        userId: "user1",
        roles: ["admin"],
        tenantId: "tenant1",
        pageNumber: 0,
        pageSize: 10,
      },
      status: "Success",
      issuedAt,
    };

    const error = new Error("Query failed");
    queryService.getAuditLogs.mockRejectedValue(error);

    await expect(handler.handle(event)).rejects.toThrow(error);
    expect(logger.error).toHaveBeenCalledWith(
      "Error processing audit log event",
      error
    );
  });
});
