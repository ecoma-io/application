import { InvalidAuditContextError } from "../../errors/audit-log/invalid-audit-context.error";
import { AuditContext } from "./audit-context.vo";

describe("AuditContext", () => {
  describe("create", () => {
    it("nên tạo AuditContext hợp lệ với dữ liệu đơn giản", () => {
      // Arrange
      const contextData = {
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        sessionId: "abc123",
      };

      // Act
      const auditContext = AuditContext.create(contextData);

      // Assert
      expect(auditContext).toBeDefined();
      expect(auditContext.value).toEqual(contextData);
    });

    it("nên tạo AuditContext hợp lệ với dữ liệu nested", () => {
      // Arrange
      const contextData = {
        changedFields: {
          productName: { oldValue: "Product A", newValue: "Product B" },
          price: { oldValue: 100, newValue: 120 },
        },
        requestInfo: {
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0",
        },
      };

      // Act
      const auditContext = AuditContext.create(contextData);

      // Assert
      expect(auditContext).toBeDefined();
      expect(auditContext.value).toEqual(contextData);
    });

    it("nên ném lỗi khi giá trị không phải là object", () => {
      // Arrange, Act & Assert
      expect(() => {
        AuditContext.create(
          "not an object" as unknown as Record<string, unknown>
        );
      }).toThrow(InvalidAuditContextError);

      expect(() => {
        AuditContext.create(123 as unknown as Record<string, unknown>);
      }).toThrow(InvalidAuditContextError);

      expect(() => {
        AuditContext.create(null as unknown as Record<string, unknown>);
      }).toThrow(InvalidAuditContextError);

      expect(() => {
        AuditContext.create(undefined as unknown as Record<string, unknown>);
      }).toThrow(InvalidAuditContextError);
    });

    it("nên ném lỗi khi giá trị chứa dữ liệu không thể serialize", () => {
      // Arrange
      const contextDataWithCircularRef: Record<string, unknown> = {};
      // Tạo circular reference - sử dụng index access thay vì dot notation
      contextDataWithCircularRef["self"] = contextDataWithCircularRef;

      // Act & Assert
      expect(() => {
        AuditContext.create(contextDataWithCircularRef);
      }).toThrow(InvalidAuditContextError);
    });
  });

  describe("getProperty", () => {
    it("nên trả về giá trị của thuộc tính tồn tại", () => {
      // Arrange
      const contextData = {
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
        sessionId: "abc123",
      };
      const auditContext = AuditContext.create(contextData);

      // Act & Assert
      expect(auditContext.getProperty("ipAddress")).toBe("192.168.1.1");
      expect(auditContext.getProperty("userAgent")).toBe("Mozilla/5.0");
      expect(auditContext.getProperty("sessionId")).toBe("abc123");
    });

    it("nên trả về undefined khi thuộc tính không tồn tại", () => {
      // Arrange
      const contextData = {
        ipAddress: "192.168.1.1",
      };
      const auditContext = AuditContext.create(contextData);

      // Act & Assert
      expect(auditContext.getProperty("nonExistentProperty")).toBeUndefined();
    });
  });

  describe("hasProperty", () => {
    it("nên trả về true khi thuộc tính tồn tại", () => {
      // Arrange
      const contextData = {
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      };
      const auditContext = AuditContext.create(contextData);

      // Act & Assert
      expect(auditContext.hasProperty("ipAddress")).toBe(true);
      expect(auditContext.hasProperty("userAgent")).toBe(true);
    });

    it("nên trả về false khi thuộc tính không tồn tại", () => {
      // Arrange
      const contextData = {
        ipAddress: "192.168.1.1",
      };
      const auditContext = AuditContext.create(contextData);

      // Act & Assert
      expect(auditContext.hasProperty("nonExistentProperty")).toBe(false);
    });
  });

  describe("equals", () => {
    it("nên trả về true khi so sánh hai AuditContext có cùng giá trị", () => {
      // Arrange
      const contextData = {
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      };
      const auditContext1 = AuditContext.create(contextData);
      const auditContext2 = AuditContext.create({
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      });

      // Act & Assert
      expect(auditContext1.equals(auditContext2)).toBe(true);
    });

    it("nên trả về false khi so sánh với undefined hoặc null", () => {
      // Arrange
      const auditContext = AuditContext.create({ ipAddress: "192.168.1.1" });

      // Act & Assert
      expect(auditContext.equals(undefined)).toBe(false);
      expect(auditContext.equals(null as any)).toBe(false);
    });

    it("nên trả về false khi so sánh hai AuditContext có giá trị khác nhau", () => {
      // Arrange
      const auditContext1 = AuditContext.create({
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      });
      const auditContext2 = AuditContext.create({
        ipAddress: "192.168.1.2",
        userAgent: "Mozilla/5.0",
      });

      // Act & Assert
      expect(auditContext1.equals(auditContext2)).toBe(false);
    });

    it("nên trả về false khi so sánh hai AuditContext có số lượng thuộc tính khác nhau", () => {
      // Arrange
      const auditContext1 = AuditContext.create({
        ipAddress: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      });
      const auditContext2 = AuditContext.create({
        ipAddress: "192.168.1.1",
      });

      // Act & Assert
      expect(auditContext1.equals(auditContext2)).toBe(false);
    });
  });
});
