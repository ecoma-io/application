import { RetentionPolicy } from "@ecoma/alm-domain";
import {
  ICommandHandler,
  IGenericResult,
  IQueryHandler,
} from "@ecoma/common-application";
import { ILogger, IOffsetBasedPaginatedResult } from "@ecoma/common-domain";
import "reflect-metadata";

import { CreateRetentionPolicyCommandDto } from "../dtos/commands/create-retention-policy.command.dto";
import { UpdateRetentionPolicyCommandDto } from "../dtos/commands/update-retention-policy.command.dto";
import { RetentionPolicyQueryDto } from "../dtos/queries/retention-policy.query.dto";
import {
  IRetentionPolicyReadRepo,
  IRetentionPolicyWriteRepo,
} from "../ports/repository";
import {
  ActivateRetentionPolicyCommand,
  CreateRetentionPolicyCommand,
  DeactivateRetentionPolicyCommand,
  DeleteRetentionPolicyCommand,
  UpdateRetentionPolicyCommand,
} from "../use-cases/commands";
import { DeleteRetentionPolicyCommandHandler } from "../use-cases/commands/delete-retention-policy.command.handler";
import { GetRetentionPoliciesQuery } from "../use-cases/queries";
import { RetentionPolicyApplicationService } from "./retention-policy-application.service";

describe("RetentionPolicyApplicationService", () => {
  let service: RetentionPolicyApplicationService;
  let writeRepo: IRetentionPolicyWriteRepo;
  let readRepo: IRetentionPolicyReadRepo;
  let logger: ILogger;
  let deactivateHandler: ICommandHandler<
    DeactivateRetentionPolicyCommand,
    IGenericResult<string, string>
  >;
  let activateHandler: ICommandHandler<
    ActivateRetentionPolicyCommand,
    IGenericResult<string, string>
  >;
  let createHandler: ICommandHandler<
    CreateRetentionPolicyCommand,
    IGenericResult<string, string>
  >;
  let updateHandler: ICommandHandler<
    UpdateRetentionPolicyCommand,
    IGenericResult<string, string>
  >;
  let deleteHandler: DeleteRetentionPolicyCommandHandler;
  let getHandler: IQueryHandler<
    GetRetentionPoliciesQuery,
    IGenericResult<IOffsetBasedPaginatedResult<RetentionPolicyQueryDto>, string>
  >;

  beforeEach(() => {
    writeRepo = {
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    };

    readRepo = {
      findActive: jest.fn(),
      findByName: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      findWithOffsetPagination: jest.fn(),
      findWithCursorPagination: jest.fn(),
    };

    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };

    deactivateHandler = {
      handle: jest.fn().mockResolvedValue({
        success: true,
        data: "id1",
        error: "",
        details: "",
      }),
    };

    activateHandler = {
      handle: jest.fn().mockResolvedValue({
        success: true,
        data: "id1",
        error: "",
        details: "",
      }),
    };

    createHandler = {
      handle: jest.fn().mockResolvedValue({
        success: true,
        data: "id1",
        error: "",
        details: "",
      }),
    };

    updateHandler = {
      handle: jest.fn().mockResolvedValue({
        success: true,
        data: "id1",
        error: "",
        details: "",
      }),
    };

    deleteHandler = new DeleteRetentionPolicyCommandHandler(writeRepo, logger);
    jest.spyOn(deleteHandler, "handle").mockResolvedValue({
      success: true,
      data: "id1",
      error: "",
      details: "",
    });

    getHandler = {
      handle: jest.fn().mockResolvedValue({
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
    };

    service = new RetentionPolicyApplicationService(
      writeRepo,
      readRepo,
      logger,
      deactivateHandler,
      activateHandler,
      createHandler,
      updateHandler,
      deleteHandler,
      getHandler
    );
  });

  it("Tạo retention policy thành công", async () => {
    const dto = new CreateRetentionPolicyCommandDto();
    dto.name = "Test Policy";
    const command = new CreateRetentionPolicyCommand(dto);

    const result = await service.createRetentionPolicy(command);

    expect(result.success).toBe(true);
    expect(result.data).toBe("id1");
    expect(createHandler.handle).toHaveBeenCalledWith(command);
  });

  it("Cập nhật retention policy thành công", async () => {
    const dto = new UpdateRetentionPolicyCommandDto();
    dto.id = "id1";
    dto.name = "Updated Policy";
    const command = new UpdateRetentionPolicyCommand(dto);

    const result = await service.updateRetentionPolicy(command);

    expect(result.success).toBe(true);
    expect(result.data).toBe("id1");
    expect(updateHandler.handle).toHaveBeenCalledWith(command);
  });

  it("Xóa retention policy thành công", async () => {
    const command = new DeleteRetentionPolicyCommand({ id: "id1" });

    const result = await service.deleteRetentionPolicy("id1");

    expect(result.success).toBe(true);
    expect(result.data).toBe("id1");
    expect(deleteHandler.handle).toHaveBeenCalled();
  });

  it("Kích hoạt retention policy thành công", async () => {
    const command = new ActivateRetentionPolicyCommand({ id: "id1" });

    const result = await service.activateRetentionPolicy(command);

    expect(result.success).toBe(true);
    expect(result.data).toBe("id1");
    expect(activateHandler.handle).toHaveBeenCalledWith(command);
  });

  it("Vô hiệu hóa retention policy thành công", async () => {
    const command = new DeactivateRetentionPolicyCommand({ id: "id1" });

    const result = await service.deactivateRetentionPolicy(command);

    expect(result.success).toBe(true);
    expect(result.data).toBe("id1");
    expect(deactivateHandler.handle).toHaveBeenCalledWith(command);
  });

  it("Lấy danh sách retention policy thành công", async () => {
    const query = new GetRetentionPoliciesQuery({
      offset: 0,
      limit: 10,
    });

    const result = await service.getRetentionPolicies(query);

    expect(result.success).toBe(true);
    expect(result.data.items).toEqual([]);
    expect(result.data.total).toBe(0);
    expect(getHandler.handle).toHaveBeenCalledWith(query);
  });

  it("Lấy chi tiết retention policy thành công", async () => {
    const mockPolicy = new RetentionPolicy({
      id: "id1" as any,
      name: "Test Policy",
      description: "Test Description",
      boundedContext: "test",
      actionType: "test",
      entityType: "test",
      tenantId: "tenant1",
      retentionDays: 30,
      isActive: true,
      createdAt: new Date(),
    });

    (readRepo.findById as jest.Mock).mockResolvedValue(mockPolicy);

    const result = await service.getRetentionPolicyDetail("id1");

    expect(result).toBeDefined();
    expect(result?.id).toBe("id1");
    expect(readRepo.findById).toHaveBeenCalledWith("id1");
  });

  it("Lấy chi tiết retention policy không tồn tại", async () => {
    (readRepo.findById as jest.Mock).mockResolvedValue(null);

    const result = await service.getRetentionPolicyDetail("id1");

    expect(result).toBeNull();
    expect(readRepo.findById).toHaveBeenCalledWith("id1");
  });
});
