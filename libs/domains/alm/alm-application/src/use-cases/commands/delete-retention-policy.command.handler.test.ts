import { ILogger } from "@ecoma/common-domain";
import "reflect-metadata";

import { DeleteRetentionPolicyCommandDto } from "../../dtos/commands/delete-retention-policy.command.dto";
import { IRetentionPolicyWriteRepo } from "../../ports/repository";
import { DeleteRetentionPolicyCommand } from "./delete-retention-policy.command";
import { DeleteRetentionPolicyCommandHandler } from "./delete-retention-policy.command.handler";

// Mock dependencies
jest.mock("class-validator", () => ({
  validateSync: jest.fn().mockReturnValue([]),
}));

describe("Xử lý lệnh xóa Retention Policy", () => {
  let handler: DeleteRetentionPolicyCommandHandler;
  let repo: jest.Mocked<IRetentionPolicyWriteRepo>;
  let logger: ILogger;

  beforeEach(() => {
    repo = {
      delete: jest.fn().mockResolvedValue(undefined),
      update: jest.fn(),
      save: jest.fn(),
    } as any;
    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    handler = new DeleteRetentionPolicyCommandHandler(repo, logger);
  });

  it("Xóa thành công", async () => {
    const dto: DeleteRetentionPolicyCommandDto = { id: "id1" };
    const command = new DeleteRetentionPolicyCommand(dto);
    const result = await handler.handle(command);
    expect(result.success).toBe(true);
    expect(result.data).toBe("id1");
    expect(result.error).toBe("");
    expect(result.details).toBe("");
    expect(repo.delete).toHaveBeenCalled();
  });

  it.skip("Validate lỗi", async () => {
    const dto: DeleteRetentionPolicyCommandDto = { id: undefined as any };
    const command = new DeleteRetentionPolicyCommand(dto);
    const result = await handler.handle(command);
    expect(result.success).toBe(false);
    expect(result.error).toBe("VALIDATION_ERROR");
    expect(result.details).not.toBe("");
  });

  it("Repo lỗi", async () => {
    // Override the mock for this specific test
    repo.delete = jest.fn().mockRejectedValue(new Error("DB error"));

    const dto: DeleteRetentionPolicyCommandDto = { id: "id1" };
    const command = new DeleteRetentionPolicyCommand(dto);
    const result = await handler.handle(command);
    expect(result.success).toBe(false);
    expect(result.error).toBe("INTERNAL_ERROR");
    expect(result.details).toBe("DB error");
  });
});
