import {
  AuditLogIngestionApplicationService,
  AuditLogStatus,
} from "@ecoma/alm-application";
import { InitiatorType } from "@ecoma/alm-domain";
import { AuditLogRequestedEvent } from "@ecoma/alm-events";
import { v7 as uuidv7 } from "uuid";

import { AuditLogEventMapper } from "../mappers/audit-log-event.mapper";
import { AuditLogRequestedHandler } from "./audit-log-requested.handler";

describe("AuditLogRequestedHandler", () => {
  let handler: AuditLogRequestedHandler;
  let mockMapper: jest.Mocked<AuditLogEventMapper>;
  let mockService: jest.Mocked<AuditLogIngestionApplicationService>;

  beforeEach(() => {
    mockMapper = {
      toDto: jest.fn(),
    } as any;

    mockService = {
      handleAuditLogRequestedEvent: jest.fn().mockResolvedValue(undefined),
    } as any;

    handler = new AuditLogRequestedHandler(mockService, mockMapper);
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
  });
});
