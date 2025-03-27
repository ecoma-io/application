import { AuditLogEntryId } from "@ecoma/alm-domain";
import "reflect-metadata";
import { v7 as uuidv7 } from "uuid";

import { AuditLogStatus, IngestAuditLogCommandDto } from "../dtos";
import { IAuditLogIdFactory } from "../factories";
import { IAuditLogEntryWriteRepo } from "../ports";
import { AuditLogIngestionApplicationService } from "./audit-log-ingestion-application.service";

describe("AuditLogIngestionApplicationService", () => {
  let service: AuditLogIngestionApplicationService;
  let repo: jest.Mocked<IAuditLogEntryWriteRepo>;
  let idFactory: jest.Mocked<IAuditLogIdFactory>;

  beforeEach(() => {
    repo = { save: jest.fn() } as any;
    idFactory = {
      create: jest.fn().mockReturnValue(new AuditLogEntryId(uuidv7())),
    } as any;
    service = new AuditLogIngestionApplicationService(repo, idFactory);
  });

  it("handleAuditLogRequestedEvent nên tạo và lưu AuditLogEntry", async () => {
    // Arrange
    const dto: IngestAuditLogCommandDto = {
      timestamp: new Date().toISOString(),
      initiator: {
        type: "USER",
        id: "user-1",
        name: "Test User",
      },
      boundedContext: "IAM",
      actionType: "User.Created",
      status: AuditLogStatus.Success,
      contextData: {
        value: {
          ip: "127.0.0.1",
          userAgent: "test-agent",
        },
      },
    };

    // Act
    await service.handleAuditLogRequestedEvent(dto);

    // Assert
    expect(repo.save).toHaveBeenCalledTimes(1);
    const savedEntry = (repo.save as jest.Mock).mock.calls[0][0];
    expect(savedEntry.initiator.type).toBe("USER");
    expect(savedEntry.initiator.id).toBe("user-1");
    expect(savedEntry.boundedContext).toBe("IAM");
    expect(savedEntry.actionType).toBe("User.Created");
    expect(savedEntry.status).toBe("Success");
    expect(savedEntry.contextData?.get("ip")).toBe("127.0.0.1");
  });
});
