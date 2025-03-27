import { AuditLogStatus } from "@ecoma/alm-application";
import { InitiatorType } from "@ecoma/alm-domain";
import { AuditLogRequestedEvent } from "@ecoma/alm-events";

import { AuditLogEventMapper } from "./audit-log-event.mapper";

describe("AuditLogEventMapper", () => {
  let mapper: AuditLogEventMapper;

  beforeEach(() => {
    mapper = new AuditLogEventMapper();
  });

  it("nên chuyển đổi AuditLogRequestedEvent thành IngestAuditLogCommandDto", () => {
    const timestamp = new Date();
    const issuedAt = new Date();
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
      eventId: "event1",
      issuedAt,
    } as AuditLogRequestedEvent;

    const result = mapper.toDto(event);

    expect(result).toEqual({
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
      eventId: "event1",
      issuedAt: issuedAt.toISOString(),
    });
  });
});
