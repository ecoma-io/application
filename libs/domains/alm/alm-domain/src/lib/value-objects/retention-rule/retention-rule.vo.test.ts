import { InvalidRetentionRuleError } from "../../errors/audit-log/invalid-retention-rule.error";
import { RetentionRule } from "./retention-rule.vo";

describe("RetentionRule", () => {
  describe("create", () => {
    it("nên tạo RetentionRule hợp lệ với đầy đủ thông tin", () => {
      // Arrange & Act
      const rule = RetentionRule.create(
        30, // 30 ngày
        "IAM", // BC
        "User.Created", // actionType
        "User", // entityType
        "tenant-123" // tenantId
      );

      // Assert
      expect(rule).toBeDefined();
      expect(rule.boundedContext).toBe("IAM");
      expect(rule.actionType).toBe("User.Created");
      expect(rule.entityType).toBe("User");
      expect(rule.tenantId).toBe("tenant-123");
      expect(rule.retentionDuration).toBe(30);
    });

    it("nên tạo RetentionRule hợp lệ với chỉ một tiêu chí", () => {
      // Arrange & Act
      const rule = RetentionRule.create(
        90, // 90 ngày
        "IAM" // chỉ có BC
      );

      // Assert
      expect(rule).toBeDefined();
      expect(rule.boundedContext).toBe("IAM");
      expect(rule.actionType).toBeUndefined();
      expect(rule.entityType).toBeUndefined();
      expect(rule.tenantId).toBeUndefined();
      expect(rule.retentionDuration).toBe(90);
    });

    it("nên ném lỗi khi retentionDuration không phải là số nguyên", () => {
      // Arrange, Act & Assert
      expect(() => {
        RetentionRule.create(30.5, "IAM");
      }).toThrow(InvalidRetentionRuleError);
    });

    it("nên ném lỗi khi retentionDuration nhỏ hơn giá trị tối thiểu", () => {
      // Arrange, Act & Assert
      expect(() => {
        RetentionRule.create(0, "IAM");
      }).toThrow(InvalidRetentionRuleError);

      expect(() => {
        RetentionRule.create(-1, "IAM");
      }).toThrow(InvalidRetentionRuleError);
    });

    it("nên ném lỗi khi retentionDuration lớn hơn giá trị tối đa", () => {
      // Arrange, Act & Assert
      expect(() => {
        RetentionRule.create(3651, "IAM");
      }).toThrow(InvalidRetentionRuleError);
    });

    it("nên ném lỗi khi không có tiêu chí nào được cung cấp", () => {
      // Arrange, Act & Assert
      expect(() => {
        RetentionRule.create(30);
      }).toThrow(InvalidRetentionRuleError);
    });
  });

  describe("appliesTo", () => {
    it("nên trả về true khi tất cả các tiêu chí khớp", () => {
      // Arrange
      const rule = RetentionRule.create(
        30,
        "IAM",
        "User.Created",
        "User",
        "tenant-123"
      );

      // Act & Assert
      expect(rule.appliesTo("IAM", "User.Created", "User", "tenant-123")).toBe(
        true
      );
    });

    it("nên trả về true khi chỉ cần một tiêu chí khớp và các tiêu chí khác không được chỉ định trong quy tắc", () => {
      // Arrange
      const rule = RetentionRule.create(30, "IAM");

      // Act & Assert
      expect(rule.appliesTo("IAM", "User.Created", "User", "tenant-123")).toBe(
        true
      );
    });

    it("nên trả về false khi boundedContext không khớp", () => {
      // Arrange
      const rule = RetentionRule.create(30, "IAM");

      // Act & Assert
      expect(rule.appliesTo("BUM", "User.Created", "User", "tenant-123")).toBe(
        false
      );
    });

    it("nên trả về false khi actionType không khớp", () => {
      // Arrange
      const rule = RetentionRule.create(30, "IAM", "User.Created");

      // Act & Assert
      expect(rule.appliesTo("IAM", "User.Updated", "User", "tenant-123")).toBe(
        false
      );
    });

    it("nên trả về false khi entityType không khớp", () => {
      // Arrange
      const rule = RetentionRule.create(30, "IAM", "User.Created", "User");

      // Act & Assert
      expect(rule.appliesTo("IAM", "User.Created", "Role", "tenant-123")).toBe(
        false
      );
    });

    it("nên trả về false khi tenantId không khớp", () => {
      // Arrange
      const rule = RetentionRule.create(
        30,
        "IAM",
        "User.Created",
        "User",
        "tenant-123"
      );

      // Act & Assert
      expect(rule.appliesTo("IAM", "User.Created", "User", "tenant-456")).toBe(
        false
      );
    });
  });

  describe("calculateExpirationDate", () => {
    it("nên tính toán ngày hết hạn chính xác dựa trên ngày tạo và retentionDuration", () => {
      // Arrange
      const rule = RetentionRule.create(30, "IAM");
      const createdAt = new Date("2023-01-01T00:00:00Z");
      const expectedExpiration = new Date("2023-01-31T00:00:00Z");

      // Act
      const expirationDate = rule.calculateExpirationDate(createdAt);

      // Assert
      expect(expirationDate.toISOString()).toBe(
        expectedExpiration.toISOString()
      );
    });

    it("nên tính toán ngày hết hạn chính xác cho năm nhuận", () => {
      // Arrange
      const rule = RetentionRule.create(30, "IAM");
      const createdAt = new Date("2024-02-01T00:00:00Z");
      const expectedExpiration = new Date("2024-03-02T00:00:00Z");

      // Act
      const expirationDate = rule.calculateExpirationDate(createdAt);

      // Assert
      expect(expirationDate.toISOString()).toBe(
        expectedExpiration.toISOString()
      );
    });
  });

  describe("equals", () => {
    it("nên trả về true khi so sánh hai RetentionRule có cùng giá trị", () => {
      // Arrange
      const rule1 = RetentionRule.create(
        30,
        "IAM",
        "User.Created",
        "User",
        "tenant-123"
      );
      const rule2 = RetentionRule.create(
        30,
        "IAM",
        "User.Created",
        "User",
        "tenant-123"
      );

      // Act & Assert
      expect(rule1.equals(rule2)).toBe(true);
    });

    it("nên trả về false khi so sánh hai RetentionRule khác nhau", () => {
      // Arrange
      const rule1 = RetentionRule.create(
        30,
        "IAM",
        "User.Created",
        "User",
        "tenant-123"
      );
      const rule2 = RetentionRule.create(
        60,
        "IAM",
        "User.Created",
        "User",
        "tenant-123"
      );
      const rule3 = RetentionRule.create(
        30,
        "BUM",
        "User.Created",
        "User",
        "tenant-123"
      );

      // Act & Assert
      expect(rule1.equals(rule2)).toBe(false);
      expect(rule1.equals(rule3)).toBe(false);
    });

    it("nên trả về false khi so sánh với undefined hoặc null", () => {
      // Arrange
      const rule = RetentionRule.create(30, "IAM");

      // Act & Assert
      expect(rule.equals(undefined)).toBe(false);
      expect(rule.equals(null as any)).toBe(false);
    });
  });
});
