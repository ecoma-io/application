import { InvalidInitiatorError } from "../../errors/audit-log/invalid-initiator.error";
import { Initiator, InitiatorType } from "./initiator.vo";

describe("Initiator", () => {
  describe("create", () => {
    it("nên tạo initiator hợp lệ với đầy đủ thông tin", () => {
      // Arrange & Act
      const initiator = Initiator.create(
        InitiatorType.User,
        "John Doe",
        "user-123"
      );

      // Assert
      expect(initiator).toBeDefined();
      expect(initiator.type).toBe(InitiatorType.User);
      expect(initiator.name).toBe("John Doe");
      expect(initiator.id).toBe("user-123");
    });

    it("nên tạo initiator hợp lệ với type System mà không cần ID", () => {
      // Arrange & Act
      const initiator = Initiator.create(
        InitiatorType.System,
        "Background Job"
      );

      // Assert
      expect(initiator).toBeDefined();
      expect(initiator.type).toBe(InitiatorType.System);
      expect(initiator.name).toBe("Background Job");
      expect(initiator.id).toBeUndefined();
    });

    it("nên cắt khoảng trắng từ ID", () => {
      // Arrange & Act
      const initiator = Initiator.create(
        InitiatorType.User,
        "John Doe",
        "  user-123  "
      );

      // Assert
      expect(initiator.id).toBe("user-123");
    });

    it("nên ném lỗi khi type không được cung cấp", () => {
      // Arrange, Act & Assert
      expect(() => {
        Initiator.create(
          null as unknown as InitiatorType,
          "John Doe",
          "user-123"
        );
      }).toThrow(InvalidInitiatorError);

      expect(() => {
        Initiator.create(
          undefined as unknown as InitiatorType,
          "John Doe",
          "user-123"
        );
      }).toThrow(InvalidInitiatorError);
    });

    it("nên ném lỗi khi type không hợp lệ", () => {
      // Arrange, Act & Assert
      expect(() => {
        Initiator.create(
          "InvalidType" as InitiatorType,
          "John Doe",
          "user-123"
        );
      }).toThrow(InvalidInitiatorError);
    });

    it("nên ném lỗi khi name không được cung cấp", () => {
      // Arrange, Act & Assert
      expect(() => {
        Initiator.create(
          InitiatorType.User,
          null as unknown as string,
          "user-123"
        );
      }).toThrow(InvalidInitiatorError);

      expect(() => {
        Initiator.create(
          InitiatorType.User,
          undefined as unknown as string,
          "user-123"
        );
      }).toThrow(InvalidInitiatorError);
    });

    it("nên ném lỗi khi name là chuỗi rỗng", () => {
      // Arrange, Act & Assert
      expect(() => {
        Initiator.create(InitiatorType.User, "", "user-123");
      }).toThrow(InvalidInitiatorError);

      expect(() => {
        Initiator.create(InitiatorType.User, "   ", "user-123");
      }).toThrow(InvalidInitiatorError);
    });

    it("nên ném lỗi khi ID không được cung cấp cho các type khác System", () => {
      // Arrange, Act & Assert
      expect(() => {
        Initiator.create(InitiatorType.User, "John Doe", undefined);
      }).toThrow(InvalidInitiatorError);

      expect(() => {
        Initiator.create(InitiatorType.User, "John Doe", "");
      }).toThrow(InvalidInitiatorError);

      expect(() => {
        Initiator.create(InitiatorType.User, "John Doe", "  ");
      }).toThrow(InvalidInitiatorError);
    });
  });

  describe("equals", () => {
    it("nên trả về true khi so sánh hai initiator có cùng thuộc tính", () => {
      // Arrange
      const initiator1 = Initiator.create(
        InitiatorType.User,
        "John Doe",
        "user-123"
      );
      const initiator2 = Initiator.create(
        InitiatorType.User,
        "John Doe",
        "user-123"
      );

      // Act & Assert
      expect(initiator1.equals(initiator2)).toBe(true);
    });

    it("nên trả về false khi so sánh với undefined hoặc null", () => {
      // Arrange
      const initiator = Initiator.create(
        InitiatorType.User,
        "John Doe",
        "user-123"
      );

      // Act & Assert
      expect(initiator.equals(undefined)).toBe(false);
      expect(initiator.equals(null as any)).toBe(false);
    });

    it("nên trả về false khi so sánh hai initiator có type khác nhau", () => {
      // Arrange
      const initiator1 = Initiator.create(
        InitiatorType.User,
        "John Doe",
        "user-123"
      );
      const initiator2 = Initiator.create(
        InitiatorType.API,
        "John Doe",
        "user-123"
      );

      // Act & Assert
      expect(initiator1.equals(initiator2)).toBe(false);
    });

    it("nên trả về false khi so sánh hai initiator có ID khác nhau", () => {
      // Arrange
      const initiator1 = Initiator.create(
        InitiatorType.User,
        "John Doe",
        "user-123"
      );
      const initiator2 = Initiator.create(
        InitiatorType.User,
        "John Doe",
        "user-456"
      );

      // Act & Assert
      expect(initiator1.equals(initiator2)).toBe(false);
    });

    it("nên trả về false khi so sánh hai initiator có tên khác nhau", () => {
      // Arrange
      const initiator1 = Initiator.create(
        InitiatorType.User,
        "John Doe",
        "user-123"
      );
      const initiator2 = Initiator.create(
        InitiatorType.User,
        "Jane Doe",
        "user-123"
      );

      // Act & Assert
      expect(initiator1.equals(initiator2)).toBe(false);
    });
  });
});
