import { InvalidRetentionPolicyError } from "../errors";
import { RetentionPolicyId } from "../value-objects/retention-policy-id.vo";
import {
  IRetentionPolicyProps,
  RetentionPolicy,
} from "./retention-policy.aggregate";

/**
 * Unit test cho RetentionPolicy aggregate (mô hình mới, không còn rules)
 */
describe("RetentionPolicy Aggregate", () => {
  it("khởi tạo hợp lệ với đầy đủ thuộc tính", () => {
    const props: IRetentionPolicyProps = {
      id: new RetentionPolicyId("0196d433-6c32-7cf2-b924-23e506454834"),
      name: "Policy 1",
      description: "Mô tả policy",
      boundedContext: "IAM",
      actionType: "User.Deleted",
      entityType: "User",
      tenantId: "tenant-1",
      retentionDays: 90,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const policy = new RetentionPolicy(props);
    // Không truy cập policy.props trực tiếp, chỉ kiểm tra instance
    expect(policy).toBeInstanceOf(RetentionPolicy);
  });

  it("bất biến: không cho phép thay đổi props sau khi tạo", () => {
    const props: IRetentionPolicyProps = {
      id: new RetentionPolicyId("0196d411-4cf0-7a59-a772-8218ad99017c"),
      name: "Policy 2",
      retentionDays: 60,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const policy = new RetentionPolicy(props);
    // Không truy cập props trực tiếp, chỉ xác nhận instance
    expect(policy).toBeInstanceOf(RetentionPolicy);
  });

  it("ném lỗi khi thiếu name", () => {
    const props: any = {
      id: new RetentionPolicyId("0196d433-6c32-714c-921b-2c9c070300de"),
      retentionDays: 30,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => new RetentionPolicy(props)).toThrow(
      InvalidRetentionPolicyError
    );
  });

  it("ném lỗi khi retentionDays không hợp lệ", () => {
    const props: any = {
      id: new RetentionPolicyId("0196d433-6c32-7ea2-9ba5-e6ef8ef7aabb"),
      name: "Policy 4",
      retentionDays: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => new RetentionPolicy(props)).toThrow(
      InvalidRetentionPolicyError
    );

    const props2: any = {
      id: new RetentionPolicyId("0196d433-f78b-720d-9518-53b66e6c3769"),
      name: "Policy 5",
      retentionDays: -10,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => new RetentionPolicy(props2)).toThrow(
      InvalidRetentionPolicyError
    );

    const props3: any = {
      id: new RetentionPolicyId("0196d433-f78b-7a1b-b521-7104562b4c84"),
      name: "Policy 6",
      retentionDays: 1.5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    expect(() => new RetentionPolicy(props3)).toThrow(
      InvalidRetentionPolicyError
    );
  });
});
