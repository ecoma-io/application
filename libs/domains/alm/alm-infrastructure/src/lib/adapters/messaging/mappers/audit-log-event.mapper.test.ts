import { AuditLogStatus } from "@ecoma/alm-application";
import { AuditLogRequestedEvent } from "@ecoma/alm-events";

import { AuditLogEventMapper } from "./audit-log-event.mapper";

describe("AuditLogEventMapper", () => {
  let mapper: AuditLogEventMapper;

  beforeEach(() => {
    mapper = new AuditLogEventMapper();
  });

  it("nên map event sang DTO thành công với đầy đủ thông tin", () => {
    const timestamp = new Date();
    const issuedAt = new Date();
    const event: AuditLogRequestedEvent = {
      timestamp,
      initiator: {
        type: "User",
        id: "user1",
        name: "Test User",
      },
      boundedContext: "IAM",
      actionType: "User.Created",
      category: "Security",
      severity: "High",
      entityType: "User",
      entityId: "user123",
      tenantId: "tenant1",
      contextData: {
        ipAddress: "127.0.0.1",
        userAgent: "test-agent",
        roles: ["admin"],
      },
      status: "Success",
      failureReason: undefined,
      eventId: "evt-123",
      issuedAt,
    };

    const dto = mapper.toDto(event);

    expect(dto).toBeDefined();
    expect(dto.timestamp).toBe(timestamp.toISOString());
    expect(dto.initiator).toEqual(event.initiator);
    expect(dto.boundedContext).toBe(event.boundedContext);
    expect(dto.actionType).toBe(event.actionType);
    expect(dto.category).toBe(event.category);
    expect(dto.severity).toBe(event.severity);
    expect(dto.entityType).toBe(event.entityType);
    expect(dto.entityId).toBe(event.entityId);
    expect(dto.tenantId).toBe(event.tenantId);
    expect(dto.contextData).toEqual({ value: event.contextData });
    expect(dto.status).toBe(AuditLogStatus.Success);
    expect(dto.failureReason).toBeUndefined();
    expect(dto.eventId).toBe(event.eventId);
    expect(dto.issuedAt).toBe(issuedAt.toISOString());
  });

  it("nên map event thất bại sang DTO với trạng thái Failure", () => {
    const timestamp = new Date();
    const issuedAt = new Date();
    const event: AuditLogRequestedEvent = {
      timestamp,
      initiator: {
        type: "User",
        id: "user1",
        name: "Test User",
      },
      boundedContext: "IAM",
      actionType: "User.Login",
      category: "Security",
      severity: "High",
      status: "Failure",
      failureReason: "Invalid credentials",
      contextData: {
        ipAddress: "127.0.0.1",
        attemptCount: 3,
      },
      issuedAt,
    };

    const dto = mapper.toDto(event);

    expect(dto.status).toBe(AuditLogStatus.Failure);
    expect(dto.failureReason).toBe(event.failureReason);
  });

  it("nên map event với contextData undefined", () => {
    const timestamp = new Date();
    const issuedAt = new Date();
    const event: AuditLogRequestedEvent = {
      timestamp,
      initiator: {
        type: "System",
        name: "Scheduler",
      },
      boundedContext: "IAM",
      actionType: "Maintenance",
      status: "Success",
      issuedAt,
    };

    const dto = mapper.toDto(event);

    expect(dto.contextData).toBeUndefined();
  });
});
