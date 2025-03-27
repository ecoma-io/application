import { RetentionPolicy, RetentionPolicyId } from "@ecoma/alm-domain";

import { RetentionPolicyMapper } from "./retention-policy.mapper";

describe("RetentionPolicyMapper", () => {
  it("Mapping fromCreateDto trả về RetentionPolicy đầy đủ trường", () => {
    const dto = {
      name: "Policy 1",
      description: "Test policy",
      boundedContext: "identity",
      actionType: "User.Created",
      entityType: "User",
      tenantId: "tenant-1",
      retentionDays: 90,
      isActive: true,
    };

    const policy = RetentionPolicyMapper.fromCreateDto(dto);

    expect(policy).toBeInstanceOf(RetentionPolicy);
    expect(policy.id).toBeInstanceOf(RetentionPolicyId);
    expect(policy.name).toBe(dto.name);
    expect(policy.description).toBe(dto.description);
    expect(policy.boundedContext).toBe(dto.boundedContext);
    expect(policy.actionType).toBe(dto.actionType);
    expect(policy.entityType).toBe(dto.entityType);
    expect(policy.tenantId).toBe(dto.tenantId);
    expect(policy.retentionDays).toBe(dto.retentionDays);
    expect(policy.isActive).toBe(dto.isActive);
    expect(policy.createdAt).toBeInstanceOf(Date);
  });

  it("Mapping fromUpdateDto trả về đúng dữ liệu", () => {
    const dto = {
      id: "test-id",
      name: "Policy 2",
      description: "Updated policy",
      boundedContext: "identity",
      actionType: "User.Created",
      entityType: "User",
      tenantId: "tenant-1",
      retentionDays: 90,
      isActive: true,
    };

    const props = RetentionPolicyMapper.fromUpdateDto(dto);

    expect(props.name).toBe(dto.name);
    expect(props.description).toBe(dto.description);
    expect(props.boundedContext).toBe(dto.boundedContext);
    expect(props.actionType).toBe(dto.actionType);
    expect(props.entityType).toBe(dto.entityType);
    expect(props.tenantId).toBe(dto.tenantId);
    expect(props.retentionDays).toBe(dto.retentionDays);
    expect(props.isActive).toBe(dto.isActive);
  });

  it("Mapping toQueryDto trả về đúng dữ liệu", () => {
    const createdAt = new Date("2024-01-01T00:00:00Z");
    const updatedAt = new Date("2024-01-02T00:00:00Z");
    const policy = new RetentionPolicy({
      id: new RetentionPolicyId("0196d4e3-f6ec-7b71-b84e-eb377290e827"),
      name: "Policy 3",
      description: "Test policy",
      boundedContext: "identity",
      actionType: "User.Created",
      entityType: "User",
      tenantId: "tenant-1",
      retentionDays: 90,
      isActive: true,
      createdAt,
      updatedAt,
    });

    const dto = RetentionPolicyMapper.toQueryDto(policy);

    expect(dto.id).toBe("0196d4e3-f6ec-7b71-b84e-eb377290e827");
    expect(dto.name).toBe(policy.name);
    expect(dto.description).toBe(policy.description);
    expect(dto.boundedContext).toBe(policy.boundedContext);
    expect(dto.actionType).toBe(policy.actionType);
    expect(dto.entityType).toBe(policy.entityType);
    expect(dto.tenantId).toBe(policy.tenantId);
    expect(dto.retentionDays).toBe(policy.retentionDays);
    expect(dto.isActive).toBe(policy.isActive);
    expect(dto.createdAt).toBe(policy.createdAt);
    expect(dto.updatedAt).toBe(policy.updatedAt);
  });
});
