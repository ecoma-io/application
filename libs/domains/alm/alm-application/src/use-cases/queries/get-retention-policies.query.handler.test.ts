import { RetentionPolicy, RetentionPolicyId } from "@ecoma/alm-domain";
import { ILogger } from "@ecoma/common-domain";
import { plainToInstance } from "class-transformer";
import "reflect-metadata";

import { GetRetentionPoliciesQueryDto } from "../../dtos/queries/get-retention-policies.query.dto";
import { IRetentionPolicyReadRepo } from "../../ports/repository";
import { GetRetentionPoliciesQuery } from "./get-retention-policies.query";
import { GetRetentionPoliciesQueryHandler } from "./get-retention-policies.query.handler";

describe("Xử lý truy vấn danh sách Retention Policy", () => {
  let handler: GetRetentionPoliciesQueryHandler;
  let repo: jest.Mocked<IRetentionPolicyReadRepo>;
  let logger: ILogger;

  beforeEach(() => {
    repo = {
      findWithOffsetPagination: jest.fn(),
      findById: jest.fn(),
      findActive: jest.fn(),
    } as any;

    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    handler = new GetRetentionPoliciesQueryHandler(repo, logger);
  });

  it("Truy vấn thành công với phân trang mặc định", async () => {
    // Arrange
    const mockPolicies = [
      new RetentionPolicy({
        id: new RetentionPolicyId("0196d4e3-f6ec-7b71-b84e-eb377290e827"),
        name: "Policy 1",
        description: "Test policy",
        boundedContext: "identity",
        actionType: "User.Created",
        entityType: "User",
        tenantId: "tenant-1",
        retentionDays: 90,
        isActive: true,
        createdAt: new Date(),
      }),
    ];

    repo.findWithOffsetPagination.mockResolvedValue({
      items: mockPolicies,
      total: 1,
      offset: 0,
      limit: 10,
    });

    const query = new GetRetentionPoliciesQuery(
      new GetRetentionPoliciesQueryDto()
    );

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.offset).toBe(0);
    expect(result.limit).toBe(10);
    expect(repo.findWithOffsetPagination).toHaveBeenCalled();
  });

  it("Truy vấn thành công với filter activeOnly", async () => {
    // Arrange
    const dto = new GetRetentionPoliciesQueryDto();
    dto.activeOnly = true;

    const mockPolicies = [
      new RetentionPolicy({
        id: new RetentionPolicyId("0196d4e3-f6ec-7b71-b84e-eb377290e827"),
        name: "Policy 1",
        description: "Test policy",
        boundedContext: "identity",
        actionType: "User.Created",
        entityType: "User",
        tenantId: "tenant-1",
        retentionDays: 90,
        isActive: true,
        createdAt: new Date(),
      }),
    ];

    repo.findWithOffsetPagination.mockResolvedValue({
      items: mockPolicies,
      total: 1,
      offset: 0,
      limit: 10,
    });

    const query = new GetRetentionPoliciesQuery(dto);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.items).toHaveLength(1);
    expect(result.items[0].isActive).toBe(true);
    expect(repo.findWithOffsetPagination).toHaveBeenCalledWith(
      expect.objectContaining({
        getFilters: expect.any(Function),
      }),
      expect.any(Object)
    );
  });

  it("Truy vấn thành công với sắp xếp tùy chỉnh", async () => {
    // Arrange
    const dto = plainToInstance(GetRetentionPoliciesQueryDto, {
      sorts: [{ field: "name", direction: "asc" }],
    });

    const mockPolicies = [
      new RetentionPolicy({
        id: new RetentionPolicyId("0196d4e3-f6ec-7b71-b84e-eb377290e827"),
        name: "Policy 1",
        description: "Test policy",
        boundedContext: "identity",
        actionType: "User.Created",
        entityType: "User",
        tenantId: "tenant-1",
        retentionDays: 90,
        isActive: true,
        createdAt: new Date(),
      }),
    ];

    repo.findWithOffsetPagination.mockResolvedValue({
      items: mockPolicies,
      total: 1,
      offset: 0,
      limit: 10,
    });

    const query = new GetRetentionPoliciesQuery(dto);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.items).toHaveLength(1);
    expect(repo.findWithOffsetPagination).toHaveBeenCalledWith(
      expect.objectContaining({
        getSorts: expect.any(Function),
      }),
      expect.any(Object)
    );
  });

  it("Validate lỗi với dữ liệu không hợp lệ", async () => {
    // Arrange
    const dto = new GetRetentionPoliciesQueryDto();
    dto.limit = -1; // Invalid limit
    dto.offset = -1; // Invalid offset

    const query = new GetRetentionPoliciesQuery(dto);

    // Act & Assert
    await expect(handler.execute(query)).rejects.toThrow("VALIDATION_ERROR");
    expect(logger.warn).toHaveBeenCalledWith(
      "Dữ liệu không hợp lệ",
      expect.any(Object)
    );
  });

  it("Xử lý lỗi khi repo gặp vấn đề", async () => {
    // Arrange
    repo.findWithOffsetPagination.mockRejectedValue(new Error("DB error"));
    const query = new GetRetentionPoliciesQuery(
      new GetRetentionPoliciesQueryDto()
    );

    // Act & Assert
    await expect(handler.execute(query)).rejects.toThrow("DB error");
    expect(logger.error).toHaveBeenCalled();
  });
});
