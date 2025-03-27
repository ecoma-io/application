import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";

import { AuditLogIngestionService } from "./ingestion.service";
import { IAuditLog, IAuditLogEvent } from "./interfaces/audit-log.interface";

describe("AuditLogIngestionService", () => {
  let service: AuditLogIngestionService;
  let mockAuditLogModel: Model<IAuditLog>;

  const mockValidEvent: IAuditLogEvent = {
    eventId: "test-event-1",
    timestamp: new Date().toISOString(),
    initiator: {
      type: "user",
      id: "user-123",
      name: "Test User",
    },
    actionType: "create",
    category: "user-management",
    severity: "info",
    entityId: "entity-123",
    entityType: "user",
    boundedContext: "iam",
    tenantId: "tenant-123",
    contextData: {},
    status: "Success",
  };

  beforeEach(async () => {
    mockAuditLogModel = {
      create: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogIngestionService,
        {
          provide: getModelToken("AuditLog"),
          useValue: mockAuditLogModel,
        },
      ],
    }).compile();

    service = module.get<AuditLogIngestionService>(AuditLogIngestionService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("handleAuditLogEvent", () => {
    it("should successfully create audit log for valid event", async () => {
      await service.handleAuditLogEvent(mockValidEvent);
      expect(mockAuditLogModel.create).toHaveBeenCalledTimes(1);
      const createCall = (mockAuditLogModel.create as jest.Mock).mock
        .calls[0][0];
      expect(createCall).toMatchObject({
        eventId: mockValidEvent.eventId,
        initiator: mockValidEvent.initiator,
        actionType: mockValidEvent.actionType,
        status: mockValidEvent.status,
      });
    });

    it("should not create audit log for invalid event", async () => {
      const invalidEvent = {
        // Missing required fields
        eventId: "test-event-2",
      };

      await service.handleAuditLogEvent(invalidEvent);

      expect(mockAuditLogModel.create).not.toHaveBeenCalled();
    });

    it("should throw error when database operation fails", async () => {
      mockAuditLogModel.create = jest
        .fn()
        .mockRejectedValue(new Error("DB Error"));

      await expect(service.handleAuditLogEvent(mockValidEvent)).rejects.toThrow(
        "DB Error"
      );
    });
  });
});
