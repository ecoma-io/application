import { InvalidAuditLogQueryCriteriaError } from "../../errors/audit-log/invalid-audit-log-query-criteria.error";
import { InitiatorType } from "../initiator/initiator.vo";
import {
  AuditLogCategory,
  AuditLogQueryCriteria,
  AuditLogSeverity,
  AuditLogStatus,
  SortOrder,
} from "./audit-log-query-criteria.vo";

describe("AuditLogQueryCriteria", () => {
  describe("create", () => {
    it("nên tạo instance với giá trị mặc định khi không cung cấp props", () => {
      // Act
      const criteria = AuditLogQueryCriteria.create();

      // Assert
      expect(criteria).toBeDefined();
      expect(criteria.pageNumber).toBe(1);
      expect(criteria.pageSize).toBe(20);
      expect(criteria.sortOrder).toBe(SortOrder.Descending);
    });

    it("nên tạo instance với đầy đủ thuộc tính hợp lệ", () => {
      // Arrange
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      const props = {
        tenantId: "tenant-123",
        initiatorType: InitiatorType.User,
        initiatorId: "user-123",
        boundedContext: "IAM",
        actionType: "User.Created",
        category: AuditLogCategory.Security,
        severity: AuditLogSeverity.High,
        entityType: "User",
        entityId: "user-456",
        timestampRange: {
          from: yesterday,
          to: now,
        },
        createdAtRange: {
          from: yesterday,
          to: now,
        },
        status: AuditLogStatus.Success,
        contextDataFilters: [
          {
            key: "ipAddress",
            value: "192.168.1.1",
            operator: "equals" as const,
          },
        ],
        pageNumber: 2,
        pageSize: 50,
        sortBy: "timestamp",
        sortOrder: SortOrder.Ascending,
      };

      // Act
      const criteria = AuditLogQueryCriteria.create(props);

      // Assert
      expect(criteria).toBeDefined();
      expect(criteria.tenantId).toBe("tenant-123");
      expect(criteria.initiatorType).toBe(InitiatorType.User);
      expect(criteria.initiatorId).toBe("user-123");
      expect(criteria.boundedContext).toBe("IAM");
      expect(criteria.actionType).toBe("User.Created");
      expect(criteria.category).toBe(AuditLogCategory.Security);
      expect(criteria.severity).toBe(AuditLogSeverity.High);
      expect(criteria.entityType).toBe("User");
      expect(criteria.entityId).toBe("user-456");
      expect(criteria.timestampRange).toEqual({
        from: yesterday,
        to: now,
      });
      expect(criteria.createdAtRange).toEqual({
        from: yesterday,
        to: now,
      });
      expect(criteria.status).toBe(AuditLogStatus.Success);
      expect(criteria.contextDataFilters).toEqual([
        { key: "ipAddress", value: "192.168.1.1", operator: "equals" },
      ]);
      expect(criteria.pageNumber).toBe(2);
      expect(criteria.pageSize).toBe(50);
      expect(criteria.sortBy).toBe("timestamp");
      expect(criteria.sortOrder).toBe(SortOrder.Ascending);
    });

    it("nên ném lỗi khi pageNumber nhỏ hơn 1", () => {
      // Arrange & Act & Assert
      expect(() => {
        AuditLogQueryCriteria.create({ pageNumber: 0 });
      }).toThrow(InvalidAuditLogQueryCriteriaError);

      expect(() => {
        AuditLogQueryCriteria.create({ pageNumber: -1 });
      }).toThrow(InvalidAuditLogQueryCriteriaError);
    });

    it("nên ném lỗi khi pageSize nhỏ hơn 1", () => {
      // Arrange & Act & Assert
      expect(() => {
        AuditLogQueryCriteria.create({ pageSize: 0 });
      }).toThrow(InvalidAuditLogQueryCriteriaError);

      expect(() => {
        AuditLogQueryCriteria.create({ pageSize: -1 });
      }).toThrow(InvalidAuditLogQueryCriteriaError);
    });

    it("nên ném lỗi khi pageSize lớn hơn giá trị tối đa", () => {
      // Arrange & Act & Assert
      expect(() => {
        AuditLogQueryCriteria.create({ pageSize: 101 });
      }).toThrow(InvalidAuditLogQueryCriteriaError);
    });

    it("nên ném lỗi khi khoảng thời gian timestampRange không hợp lệ", () => {
      // Arrange
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Act & Assert
      expect(() => {
        AuditLogQueryCriteria.create({
          timestampRange: {
            from: tomorrow,
            to: now,
          },
        });
      }).toThrow(InvalidAuditLogQueryCriteriaError);
    });

    it("nên ném lỗi khi khoảng thời gian createdAtRange không hợp lệ", () => {
      // Arrange
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Act & Assert
      expect(() => {
        AuditLogQueryCriteria.create({
          createdAtRange: {
            from: tomorrow,
            to: now,
          },
        });
      }).toThrow(InvalidAuditLogQueryCriteriaError);
    });

    it("nên ném lỗi khi contextDataFilters chứa filter với key rỗng", () => {
      // Arrange & Act & Assert
      expect(() => {
        AuditLogQueryCriteria.create({
          contextDataFilters: [{ key: "" }],
        });
      }).toThrow(InvalidAuditLogQueryCriteriaError);

      expect(() => {
        AuditLogQueryCriteria.create({
          contextDataFilters: [{ key: "  " }],
        });
      }).toThrow(InvalidAuditLogQueryCriteriaError);
    });
  });

  describe("calculateOffset", () => {
    it("nên tính offset chính xác dựa trên pageNumber và pageSize", () => {
      // Arrange
      const criteria1 = AuditLogQueryCriteria.create({
        pageNumber: 1,
        pageSize: 20,
      });
      const criteria2 = AuditLogQueryCriteria.create({
        pageNumber: 2,
        pageSize: 20,
      });
      const criteria3 = AuditLogQueryCriteria.create({
        pageNumber: 3,
        pageSize: 10,
      });

      // Act & Assert
      expect(criteria1.calculateOffset()).toBe(0);
      expect(criteria2.calculateOffset()).toBe(20);
      expect(criteria3.calculateOffset()).toBe(20);
    });
  });

  describe("withPageNumber", () => {
    it("nên tạo instance mới với pageNumber đã cập nhật", () => {
      // Arrange
      const criteria = AuditLogQueryCriteria.create({
        pageNumber: 1,
        pageSize: 20,
        tenantId: "tenant-123",
      });

      // Act
      const updatedCriteria = criteria.withPageNumber(2);

      // Assert
      expect(updatedCriteria).not.toBe(criteria); // Nên là instance mới
      expect(updatedCriteria.pageNumber).toBe(2);
      expect(updatedCriteria.pageSize).toBe(20);
      expect(updatedCriteria.tenantId).toBe("tenant-123");
    });

    it("nên ném lỗi khi pageNumber mới nhỏ hơn 1", () => {
      // Arrange
      const criteria = AuditLogQueryCriteria.create();

      // Act & Assert
      expect(() => {
        criteria.withPageNumber(0);
      }).toThrow(InvalidAuditLogQueryCriteriaError);
    });
  });

  describe("withPageSize", () => {
    it("nên tạo instance mới với pageSize đã cập nhật", () => {
      // Arrange
      const criteria = AuditLogQueryCriteria.create({
        pageNumber: 1,
        pageSize: 20,
        tenantId: "tenant-123",
      });

      // Act
      const updatedCriteria = criteria.withPageSize(30);

      // Assert
      expect(updatedCriteria).not.toBe(criteria); // Nên là instance mới
      expect(updatedCriteria.pageNumber).toBe(1);
      expect(updatedCriteria.pageSize).toBe(30);
      expect(updatedCriteria.tenantId).toBe("tenant-123");
    });

    it("nên ném lỗi khi pageSize mới nhỏ hơn 1", () => {
      // Arrange
      const criteria = AuditLogQueryCriteria.create();

      // Act & Assert
      expect(() => {
        criteria.withPageSize(0);
      }).toThrow(InvalidAuditLogQueryCriteriaError);
    });

    it("nên ném lỗi khi pageSize mới lớn hơn giá trị tối đa", () => {
      // Arrange
      const criteria = AuditLogQueryCriteria.create();

      // Act & Assert
      expect(() => {
        criteria.withPageSize(101);
      }).toThrow(InvalidAuditLogQueryCriteriaError);
    });
  });

  describe("withSort", () => {
    it("nên tạo instance mới với sortBy và sortOrder đã cập nhật", () => {
      // Arrange
      const criteria = AuditLogQueryCriteria.create({
        pageNumber: 1,
        pageSize: 20,
        sortBy: "timestamp",
        sortOrder: SortOrder.Descending,
      });

      // Act
      const updatedCriteria = criteria.withSort(
        "createdAt",
        SortOrder.Ascending
      );

      // Assert
      expect(updatedCriteria).not.toBe(criteria); // Nên là instance mới
      expect(updatedCriteria.sortBy).toBe("createdAt");
      expect(updatedCriteria.sortOrder).toBe(SortOrder.Ascending);
      expect(updatedCriteria.pageNumber).toBe(1);
      expect(updatedCriteria.pageSize).toBe(20);
    });

    it("nên sử dụng sortOrder mặc định là Descending khi không cung cấp", () => {
      // Arrange
      const criteria = AuditLogQueryCriteria.create({
        sortBy: "timestamp",
        sortOrder: SortOrder.Ascending,
      });

      // Act
      const updatedCriteria = criteria.withSort("createdAt");

      // Assert
      expect(updatedCriteria.sortBy).toBe("createdAt");
      expect(updatedCriteria.sortOrder).toBe(SortOrder.Descending);
    });
  });

  describe("equals", () => {
    it("nên trả về true khi so sánh hai criteria giống nhau", () => {
      // Arrange
      const criteria1 = AuditLogQueryCriteria.create({
        tenantId: "tenant-123",
        pageNumber: 2,
        pageSize: 30,
      });
      const criteria2 = AuditLogQueryCriteria.create({
        tenantId: "tenant-123",
        pageNumber: 2,
        pageSize: 30,
      });

      // Act & Assert
      expect(criteria1.equals(criteria2)).toBe(true);
    });

    it("nên trả về false khi so sánh với undefined hoặc null", () => {
      // Arrange
      const criteria = AuditLogQueryCriteria.create();

      // Act & Assert
      expect(criteria.equals(undefined)).toBe(false);
      expect(criteria.equals(null as any)).toBe(false);
    });

    it("nên trả về false khi so sánh hai criteria khác nhau", () => {
      // Arrange
      const criteria1 = AuditLogQueryCriteria.create({
        tenantId: "tenant-123",
        pageNumber: 2,
        pageSize: 30,
      });
      const criteria2 = AuditLogQueryCriteria.create({
        tenantId: "tenant-456",
        pageNumber: 2,
        pageSize: 30,
      });
      const criteria3 = AuditLogQueryCriteria.create({
        tenantId: "tenant-123",
        pageNumber: 3,
        pageSize: 30,
      });

      // Act & Assert
      expect(criteria1.equals(criteria2)).toBe(false);
      expect(criteria1.equals(criteria3)).toBe(false);
    });
  });
});
