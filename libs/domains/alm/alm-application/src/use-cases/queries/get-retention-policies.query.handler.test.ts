import { RetentionPolicy, RetentionPolicyId } from "@ecoma/alm-domain";
import { IGenericResult, IQueryHandler } from "@ecoma/common-application";
import { ILogger, IOffsetBasedPaginatedResult } from "@ecoma/common-domain";
import { plainToInstance } from "class-transformer";
import "reflect-metadata";

import { GetRetentionPoliciesQueryDto } from "../../dtos/queries/get-retention-policies.query.dto";
import { RetentionPolicyQueryDto } from "../../dtos/queries/retention-policy.query.dto";
import { IRetentionPolicyReadRepo } from "../../ports/repository";
import { GetRetentionPoliciesQuery } from "./get-retention-policies.query";
import { GetRetentionPoliciesQueryHandler } from "./get-retention-policies.query.handler";

type GetRetentionPoliciesResult = IGenericResult<
  IOffsetBasedPaginatedResult<RetentionPolicyQueryDto>,
  string
>;

describe("Xử lý truy vấn danh sách Retention Policy", () => {
  let handler: IQueryHandler<
    GetRetentionPoliciesQuery,
    GetRetentionPoliciesResult
  >;
  let retentionPolicyRepo: IRetentionPolicyReadRepo;
  let logger: ILogger;

  beforeEach(() => {
    retentionPolicyRepo = {
      findActive: jest.fn(),
      findByName: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      findWithOffsetPagination: jest.fn().mockResolvedValue({
        items: [],
        total: 0,
        offset: 0,
        limit: 10,
      }),
      findWithCursorPagination: jest.fn(),
    };

    logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };

    handler = new GetRetentionPoliciesQueryHandler(retentionPolicyRepo, logger);
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

    (
      retentionPolicyRepo.findWithOffsetPagination as jest.Mock
    ).mockResolvedValue({
      items: mockPolicies,
      total: 1,
      offset: 0,
      limit: 10,
    });

    const query = new GetRetentionPoliciesQuery(
      new GetRetentionPoliciesQueryDto()
    );

    // Act
    const result = await handler.handle(query);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data.items).toHaveLength(1);
    expect(result.data.total).toBe(1);
    expect(result.data.offset).toBe(0);
    expect(result.data.limit).toBe(10);
    expect(retentionPolicyRepo.findWithOffsetPagination).toHaveBeenCalled();
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

    (
      retentionPolicyRepo.findWithOffsetPagination as jest.Mock
    ).mockResolvedValue({
      items: mockPolicies,
      total: 1,
      offset: 0,
      limit: 10,
    });

    const query = new GetRetentionPoliciesQuery(dto);

    // Act
    const result = await handler.handle(query);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data.items).toHaveLength(1);
    expect(result.data.items[0].isActive).toBe(true);
    expect(retentionPolicyRepo.findWithOffsetPagination).toHaveBeenCalledWith(
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

    (
      retentionPolicyRepo.findWithOffsetPagination as jest.Mock
    ).mockResolvedValue({
      items: mockPolicies,
      total: 1,
      offset: 0,
      limit: 10,
    });

    const query = new GetRetentionPoliciesQuery(dto);

    // Act
    const result = await handler.handle(query);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data.items).toHaveLength(1);
    expect(retentionPolicyRepo.findWithOffsetPagination).toHaveBeenCalledWith(
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

    // Act
    const result = await handler.handle(query);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("VALIDATION_ERROR");
    expect(result.data.items).toEqual([]);
    expect(result.data.total).toBe(0);
    expect(result.data.offset).toBe(-1);
    expect(result.data.limit).toBe(-1);
    expect(logger.warn).toHaveBeenCalledWith(
      "Dữ liệu không hợp lệ",
      expect.any(Object)
    );
  });

  it("Xử lý lỗi khi repo gặp vấn đề", async () => {
    // Arrange
    (
      retentionPolicyRepo.findWithOffsetPagination as jest.Mock
    ).mockRejectedValue(new Error("DB error"));
    const query = new GetRetentionPoliciesQuery(
      new GetRetentionPoliciesQueryDto()
    );

    // Act
    const result = await handler.handle(query);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe("QUERY_FAILED");
    expect(result.data.items).toEqual([]);
    expect(result.data.total).toBe(0);
    expect(result.data.offset).toBe(0);
    expect(result.data.limit).toBe(10);
    expect(logger.error).toHaveBeenCalled();
  });
});
