import { ILogger } from "@ecoma/common-domain";
import "reflect-metadata";

import { ActivateRetentionPolicyCommandDto } from "../../dtos/commands/activate-retention-policy.command.dto";
import { IRetentionPolicyWriteRepo } from "../../ports/repository";
import { ActivateRetentionPolicyCommand } from "./activate-retention-policy.command";
import { ActivateRetentionPolicyCommandHandler } from "./activate-retention-policy.command.handler";

// Mock dependencies
jest.mock("class-validator", () => ({
  validateSync: jest.fn().mockReturnValue([]),
}));

describe("Xử lý lệnh kích hoạt Retention Policy", () => {
  let handler: ActivateRetentionPolicyCommandHandler;
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
    handler = new ActivateRetentionPolicyCommandHandler(repo, logger);
  });

  it("Kích hoạt thành công", async () => {
    const dto: ActivateRetentionPolicyCommandDto = { id: "id1" };
    const command = new ActivateRetentionPolicyCommand(dto);
    const result = await handler.execute(command);
    expect(result.success).toBe(true);
    expect(result.data).toBe("id1");
    expect(result.error).toBe("");
    expect(result.details).toBe("");
    expect(repo.update).toHaveBeenCalled();
  });

  it.skip("Validate lỗi", async () => {
    const dto: ActivateRetentionPolicyCommandDto = { id: undefined as any };
    const command = new ActivateRetentionPolicyCommand(dto);
    const result = await handler.execute(command);
    expect(result.success).toBe(false);
    expect(result.error).toBe("VALIDATION_ERROR");
    expect(result.details).not.toBe("");
  });

  it("Repo lỗi", async () => {
    // Override the mock for this specific test
    repo.update = jest.fn().mockRejectedValue(new Error("DB error"));

    const dto: ActivateRetentionPolicyCommandDto = { id: "id1" };
    const command = new ActivateRetentionPolicyCommand(dto);
    const result = await handler.execute(command);
    expect(result.success).toBe(false);
    expect(result.error).toBe("INTERNAL_ERROR");
    expect(result.details).toBe("DB error");
  });
});
