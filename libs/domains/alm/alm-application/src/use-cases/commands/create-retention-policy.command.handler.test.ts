import { ILogger } from "@ecoma/common-domain";
import "reflect-metadata";

import { CreateRetentionPolicyCommandDto } from "../../dtos/commands/create-retention-policy.command.dto";
import { IRetentionPolicyWriteRepo } from "../../ports/repository";
import { CreateRetentionPolicyCommand } from "./create-retention-policy.command";
import { CreateRetentionPolicyCommandHandler } from "./create-retention-policy.command.handler";

describe("Xử lý lệnh tạo Retention Policy", () => {
  let handler: CreateRetentionPolicyCommandHandler;
  let repo: jest.Mocked<IRetentionPolicyWriteRepo>;
  let logger: ILogger;

  beforeEach(() => {
    // Create a proper mock implementation
    repo = {
      save: jest.fn().mockResolvedValue(undefined),
      update: jest.fn(),
    } as any;
    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    handler = new CreateRetentionPolicyCommandHandler(repo, logger);
  });

  it("Tạo thành công", async () => {
    const dto: CreateRetentionPolicyCommandDto = {
      name: "Policy 1",
      description: "Test policy",
      boundedContext: "identity",
      actionType: "User.Created",
      entityType: "User",
      tenantId: "tenant-1",
      retentionDays: 90,
      isActive: true,
    };
    const command = new CreateRetentionPolicyCommand(dto);
    const result = await handler.execute(command);
    expect(result.success).toBe(true);
    expect(result.data).toBe("");
    expect(result.error).toBe("");
    expect(result.details).toBe("");
    expect(repo.save).toHaveBeenCalled();
  });

  it("Validate lỗi", async () => {
    const dto: CreateRetentionPolicyCommandDto = {
      name: "",
      description: "",
      boundedContext: "",
      actionType: "",
      entityType: "",
      tenantId: "",
      retentionDays: 0,
      isActive: true,
    } as any;
    const command = new CreateRetentionPolicyCommand(dto);
    const result = await handler.execute(command);
    expect(result.success).toBe(false);
    expect(result.error).toBe("VALIDATION_ERROR");
    expect(result.details).not.toBe("");
  });

  it("Repo lỗi", async () => {
    // Set up the mock to reject for this test specifically
    repo.save = jest.fn().mockRejectedValue(new Error("DB error"));

    const dto: CreateRetentionPolicyCommandDto = {
      name: "Policy 1",
      description: "Test policy",
      boundedContext: "identity",
      actionType: "User.Created",
      entityType: "User",
      tenantId: "tenant-1",
      retentionDays: 90,
      isActive: true,
    };
    const command = new CreateRetentionPolicyCommand(dto);
    const result = await handler.execute(command);
    expect(result.success).toBe(false);
    expect(result.error).toBe("INTERNAL_ERROR");
    expect(result.details).toBe("DB error");
  });
});
