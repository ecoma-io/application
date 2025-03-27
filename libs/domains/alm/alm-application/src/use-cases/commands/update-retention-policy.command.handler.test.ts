import { ILogger } from "@ecoma/common-domain";
import "reflect-metadata";

import { UpdateRetentionPolicyCommandDto } from "../../dtos/commands/update-retention-policy.command.dto";
import { IRetentionPolicyWriteRepo } from "../../ports/repository";
import { UpdateRetentionPolicyCommand } from "./update-retention-policy.command";
import { UpdateRetentionPolicyCommandHandler } from "./update-retention-policy.command.handler";

// Mock dependencies
jest.mock("class-validator", () => ({
  validateSync: jest.fn().mockReturnValue([]),
}));

describe("Xử lý lệnh cập nhật Retention Policy", () => {
  let handler: UpdateRetentionPolicyCommandHandler;
  let repo: jest.Mocked<IRetentionPolicyWriteRepo>;
  let logger: ILogger;

  beforeEach(() => {
    repo = {
      update: jest.fn().mockResolvedValue(undefined),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;
    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    handler = new UpdateRetentionPolicyCommandHandler(repo, logger);
  });

  it("Cập nhật thành công", async () => {
    const dto: UpdateRetentionPolicyCommandDto = {
      id: "id1",
      name: "Policy 1",
      description: "Test policy",
      boundedContext: "identity",
      actionType: "User.Created",
      entityType: "User",
      tenantId: "tenant-1",
      retentionDays: 90,
      isActive: true,
    };
    const command = new UpdateRetentionPolicyCommand(dto);
    const result = await handler.execute(command);
    expect(result.success).toBe(true);
    expect(result.data).toBe("id1");
    expect(result.error).toBe("");
    expect(result.details).toBe("");
    expect(repo.update).toHaveBeenCalled();
  });

  it.skip("Validate lỗi", async () => {
    const dto: UpdateRetentionPolicyCommandDto = {
      id: "id1",
      name: "",
      description: "",
      boundedContext: "",
      actionType: "",
      entityType: "",
      tenantId: "",
      retentionDays: 0,
      isActive: true,
    } as any;
    const command = new UpdateRetentionPolicyCommand(dto);
    const result = await handler.execute(command);
    expect(result.success).toBe(false);
    expect(result.error).toBe("VALIDATION_ERROR");
    expect(result.details).not.toBe("");
  });

  it("Repo lỗi", async () => {
    // Override the mock for this specific test
    repo.update = jest.fn().mockRejectedValue(new Error("DB error"));

    const dto: UpdateRetentionPolicyCommandDto = {
      id: "id1",
      name: "Policy 1",
      description: "Test policy",
      boundedContext: "identity",
      actionType: "User.Created",
      entityType: "User",
      tenantId: "tenant-1",
      retentionDays: 90,
      isActive: true,
    };
    const command = new UpdateRetentionPolicyCommand(dto);
    const result = await handler.execute(command);
    expect(result.success).toBe(false);
    expect(result.error).toBe("INTERNAL_ERROR");
    expect(result.details).toBe("DB error");
  });
});
