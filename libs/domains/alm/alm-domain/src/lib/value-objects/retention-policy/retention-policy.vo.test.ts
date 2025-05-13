import { InvalidRetentionPolicyError } from "../../errors/audit-log/invalid-retention-policy.error";
import { RetentionRule } from "../retention-rule/retention-rule.vo";
import { RetentionPolicy } from "./retention-policy.vo";

describe("RetentionPolicy", () => {
  // Dữ liệu mẫu để sử dụng trong các test case
  const rule1 = RetentionRule.create(30, "IAM");
  const rule2 = RetentionRule.create(60, "BUM");
  const rule3 = RetentionRule.create(90, "IAM", "User.Created");
  const rule4 = RetentionRule.create(
    15,
    "IAM",
    "User.Created",
    "User",
    "tenant-123"
  );

  describe("create", () => {
    it("nên tạo RetentionPolicy hợp lệ với đầy đủ thông tin", () => {
      // Arrange & Act
      const policy = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy for audit logs",
        [rule1, rule2]
      );

      // Assert
      expect(policy).toBeDefined();
      expect(policy.name).toBe("Standard Policy");
      expect(policy.description).toBe(
        "Standard retention policy for audit logs"
      );
      expect(policy.rules).toHaveLength(2);
      expect(policy.isActive).toBe(true);
    });

    it("nên tạo RetentionPolicy với trạng thái không hoạt động khi chỉ định isActive = false", () => {
      // Arrange & Act
      const policy = RetentionPolicy.create(
        "Inactive Policy",
        "Inactive retention policy",
        [rule1, rule2],
        false
      );

      // Assert
      expect(policy).toBeDefined();
      expect(policy.isActive).toBe(false);
    });

    it("nên cắt khoảng trắng từ tên và mô tả", () => {
      // Arrange & Act
      const policy = RetentionPolicy.create(
        "  Standard Policy  ",
        "  Standard retention policy  ",
        [rule1, rule2]
      );

      // Assert
      expect(policy.name).toBe("Standard Policy");
      expect(policy.description).toBe("Standard retention policy");
    });

    it("nên ném lỗi khi tên không được cung cấp", () => {
      // Arrange, Act & Assert
      expect(() => {
        // @ts-expect-error: Testing with invalid name
        RetentionPolicy.create(null, "A description", [rule1]);
      }).toThrow(InvalidRetentionPolicyError);

      expect(() => {
        RetentionPolicy.create("", "A description", [rule1]);
      }).toThrow(InvalidRetentionPolicyError);

      expect(() => {
        RetentionPolicy.create("  ", "A description", [rule1]);
      }).toThrow(InvalidRetentionPolicyError);
    });

    it("nên ném lỗi khi mô tả không được cung cấp", () => {
      // Arrange, Act & Assert
      expect(() => {
        // @ts-expect-error: Testing with invalid description
        RetentionPolicy.create("Standard Policy", null, [rule1]);
      }).toThrow(InvalidRetentionPolicyError);

      expect(() => {
        RetentionPolicy.create("Standard Policy", "", [rule1]);
      }).toThrow(InvalidRetentionPolicyError);

      expect(() => {
        RetentionPolicy.create("Standard Policy", "  ", [rule1]);
      }).toThrow(InvalidRetentionPolicyError);
    });

    it("nên ném lỗi khi danh sách quy tắc rỗng", () => {
      // Arrange, Act & Assert
      expect(() => {
        // @ts-expect-error: Testing with invalid rules
        RetentionPolicy.create("Standard Policy", "A description", null);
      }).toThrow(InvalidRetentionPolicyError);

      expect(() => {
        RetentionPolicy.create("Standard Policy", "A description", []);
      }).toThrow(InvalidRetentionPolicyError);
    });

    it("nên ném lỗi khi danh sách quy tắc chứa phần tử không phải RetentionRule", () => {
      // Arrange, Act & Assert
      expect(() => {
        RetentionPolicy.create("Standard Policy", "A description", [
          rule1,
          {} as any, // Đối tượng không phải RetentionRule
        ]);
      }).toThrow(InvalidRetentionPolicyError);
    });
  });

  describe("rules getter", () => {
    it("nên trả về bản sao của danh sách quy tắc để tránh thay đổi từ bên ngoài", () => {
      // Arrange
      const policy = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2]
      );

      // Act
      const rules = policy.rules;
      // Thử thay đổi danh sách đã lấy
      rules.push(rule3);

      // Assert
      // danh sách gốc không bị thay đổi
      expect(policy.rules).toHaveLength(2);
      expect(rules).toHaveLength(3);
    });
  });

  describe("findShortestMatchingRule", () => {
    it("nên trả về quy tắc có thời hạn ngắn nhất khi có nhiều quy tắc khớp", () => {
      // Arrange
      const policy = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule3, rule4] // 30, 90, 15 ngày
      );

      // Act
      const shortestRule = policy.findShortestMatchingRule(
        "IAM",
        "User.Created",
        "User",
        "tenant-123"
      );

      // Assert
      expect(shortestRule).toBeDefined();
      expect(shortestRule).toBe(rule4); // rule4 có thời hạn 15 ngày
    });

    it("nên trả về undefined khi không có quy tắc nào khớp", () => {
      // Arrange
      const policy = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule3] // Chỉ áp dụng cho IAM
      );

      // Act
      const shortestRule = policy.findShortestMatchingRule("BUM");

      // Assert
      expect(shortestRule).toBeUndefined();
    });
  });

  describe("withActiveStatus", () => {
    it("nên tạo instance mới với trạng thái hoạt động đã được cập nhật", () => {
      // Arrange
      const policy = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2],
        true // active
      );

      // Act
      const inactivePolicy = policy.withActiveStatus(false);

      // Assert
      expect(inactivePolicy).not.toBe(policy); // Nên là instance mới
      expect(inactivePolicy.isActive).toBe(false);
      expect(inactivePolicy.name).toBe(policy.name);
      expect(inactivePolicy.description).toBe(policy.description);
      expect(inactivePolicy.rules).toEqual(policy.rules);

      // Kiểm tra thêm khả năng chuyển trạng thái ngược lại
      const reactivatedPolicy = inactivePolicy.withActiveStatus(true);
      expect(reactivatedPolicy.isActive).toBe(true);
    });
  });

  describe("withAddedRule", () => {
    it("nên tạo instance mới với quy tắc mới được thêm vào", () => {
      // Arrange
      const policy = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2] // Có 2 quy tắc
      );

      // Act
      const updatedPolicy = policy.withAddedRule(rule3);

      // Assert
      expect(updatedPolicy).not.toBe(policy); // Nên là instance mới
      expect(updatedPolicy.rules).toHaveLength(3); // Nên có 3 quy tắc
      expect(updatedPolicy.rules[2]).toBe(rule3); // Quy tắc mới ở cuối danh sách
      expect(updatedPolicy.name).toBe(policy.name);
      expect(updatedPolicy.description).toBe(policy.description);
      expect(updatedPolicy.isActive).toBe(policy.isActive);
    });

    it("nên ném lỗi khi tham số không phải là RetentionRule", () => {
      // Arrange
      const policy = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2]
      );

      // Act & Assert
      expect(() => {
        policy.withAddedRule({} as any);
      }).toThrow(InvalidRetentionPolicyError);
    });
  });

  describe("equals", () => {
    it("nên trả về true khi so sánh hai RetentionPolicy giống nhau", () => {
      // Arrange
      const policy1 = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2]
      );
      const policy2 = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2]
      );

      // Act & Assert
      expect(policy1.equals(policy2)).toBe(true);
    });

    it("nên trả về false khi so sánh hai RetentionPolicy khác tên", () => {
      // Arrange
      const policy1 = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2]
      );
      const policy2 = RetentionPolicy.create(
        "Different Policy",
        "Standard retention policy",
        [rule1, rule2]
      );

      // Act & Assert
      expect(policy1.equals(policy2)).toBe(false);
    });

    it("nên trả về false khi so sánh hai RetentionPolicy khác mô tả", () => {
      // Arrange
      const policy1 = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2]
      );
      const policy2 = RetentionPolicy.create(
        "Standard Policy",
        "Different description",
        [rule1, rule2]
      );

      // Act & Assert
      expect(policy1.equals(policy2)).toBe(false);
    });

    it("nên trả về false khi so sánh hai RetentionPolicy khác quy tắc", () => {
      // Arrange
      const policy1 = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2]
      );
      const policy2 = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule3]
      );

      // Act & Assert
      expect(policy1.equals(policy2)).toBe(false);
    });

    it("nên trả về false khi so sánh hai RetentionPolicy khác trạng thái", () => {
      // Arrange
      const policy1 = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2],
        true
      );
      const policy2 = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2],
        false
      );

      // Act & Assert
      expect(policy1.equals(policy2)).toBe(false);
    });

    it("nên trả về false khi so sánh với undefined hoặc null", () => {
      // Arrange
      const policy = RetentionPolicy.create(
        "Standard Policy",
        "Standard retention policy",
        [rule1, rule2]
      );

      // Act & Assert
      expect(policy.equals(undefined)).toBe(false);
      expect(policy.equals(null as any)).toBe(false);
    });
  });
});
