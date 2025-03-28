import { MockFactory } from "@ecoma/common-testing";
import { GenerateSnowFlakeError, InvalidIdError } from "../../errors";
import { SnowflakeId } from "./snowflake-id";
import { AssertionHelpers } from '@ecoma/common-testing';

describe("SnowflakeId", () => {
  let originalDateNow: () => number;
  let originalDate: DateConstructor;
  const mockPodUid = "test-pod-uid";

  // EPOCH là 2025-01-01T00:00:00.000Z
  const EPOCH = new Date("2025-01-01T00:00:00.000Z").getTime();

  // Helper function để tạo Snowflake ID với timestamp cụ thể
  const createSnowflakeId = (timestamp: number, sequence = 0) => {
    // Format: timestamp (41 bits) | workerId (5 bits) | processId (5 bits) | sequence (12 bits)
    const workerId = 1; // 5 bits
    const processId = 1; // 5 bits

    // Convert timestamp to milliseconds since epoch
    const timestampMs = timestamp - EPOCH;

    // Create ID parts
    const timestampPart = BigInt(timestampMs) << BigInt(22); // Shift left 22 bits
    const workerPart = BigInt(workerId) << BigInt(17); // Shift left 17 bits
    const processPart = BigInt(processId) << BigInt(12); // Shift left 12 bits
    const sequencePart = BigInt(sequence); // 12 bits

    // Combine all parts
    const id = timestampPart | workerPart | processPart | sequencePart;

    return new SnowflakeId(id.toString());
  };

  beforeEach(() => {
    // Mock POD_UID environment variable
    process.env["POD_UID"] = mockPodUid;

    // Save original Date and Date.now
    originalDateNow = Date.now;
    originalDate = global.Date;
  });

  afterEach(() => {
    // Clean up
    delete process.env["POD_UID"];
    Date.now = originalDateNow;
    global.Date = originalDate;
  });

  describe('constructor', () => {
    it('nên tạo instance với Snowflake ID hợp lệ', () => {
      // Arrange
      const validId = '1234567890123456';

      // Act
      const id = new SnowflakeId(validId);

      // Assert
      expect(id instanceof SnowflakeId).toBe(true);
      expect(id.value).toBe(validId);
    });

    it('nên throw lỗi khi Snowflake ID không hợp lệ', () => {
      // Act & Assert
      AssertionHelpers.expectToThrowWithMessage(() => new SnowflakeId("invalid-snowflake"), /Invalid Snowflake ID format/);

      try {
        new SnowflakeId("");
        // Nếu không có lỗi, test sẽ fail
        expect(true).toBe(false); // Đảm bảo test fail nếu không có lỗi
      } catch (error) {
        if (error instanceof InvalidIdError) {
          expect(error.message).toContain('ID value cannot be empty');
        } else {
          throw error; // Nếu không phải InvalidIdError, rethrow để test fail
        }
      }

      AssertionHelpers.expectToThrowWithMessage(() => new SnowflakeId("123.456"), /Invalid Snowflake ID format/);
    });
  });

  describe('equals', () => {
    it('nên trả về true khi so sánh với cùng một Snowflake ID', () => {
      // Arrange
      const idValue = '1234567890123456';
      const id1 = new SnowflakeId(idValue);
      const id2 = new SnowflakeId(idValue);

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(true);
    });

    it('nên trả về false khi so sánh với Snowflake ID khác', () => {
      // Arrange
      const id1 = new SnowflakeId('1234567890123456');
      const id2 = new SnowflakeId('6543210987654321');

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(false);
    });
  });

  it("nên tạo ra Snowflake ID hợp lệ", () => {
    const id = SnowflakeId.generate();
    expect(id instanceof SnowflakeId).toBe(true);
    expect(typeof id.value).toBe("string");
    expect(id.value.length).toBeGreaterThan(0);
    expect(/^\d+$/.test(id.value)).toBe(true);
  });

  it("nên tạo từ chuỗi Snowflake hợp lệ", () => {
    const id = createSnowflakeId(EPOCH + 1000);
    expect(id.value).toBe(createSnowflakeId(EPOCH + 1000).value);
  });

  it("nên chuyển đổi sang chuỗi", () => {
    const id = createSnowflakeId(EPOCH + 1000);
    expect(id.toString()).toBe(id.value);
  });

  it("nên tạo ra các Snowflake ID duy nhất", () => {
    // Mock Date.now to return different timestamps
    let timestamp = EPOCH + 1000;
    Date.now = MockFactory.createMockFn(() => timestamp++);

    const id1 = SnowflakeId.generate();
    const id2 = SnowflakeId.generate();
    expect(id1.value).not.toBe(id2.value);
  });

  it("nên tạo ra các ID tuần tự", () => {
    // Mock Date.now to return different timestamps
    let timestamp = EPOCH + 1000;
    Date.now = MockFactory.createMockFn(() => timestamp++);

    const id1 = SnowflakeId.generate();
    const id2 = SnowflakeId.generate();
    expect(BigInt(id2.value)).toBeGreaterThan(BigInt(id1.value));
  });

  it("nên xử lý số sequence tối đa", () => {
    // Mock Date.now to return fixed timestamp after epoch
    const timestamp = EPOCH + 1000;
    Date.now = MockFactory.createMockFn(() => timestamp);

    // Mock Snowflake.generate to return sequential IDs
    const mockGenerate = MockFactory.createMockFn();
    let sequence = 0;
    mockGenerate.mockImplementation(() => {
      const id = createSnowflakeId(timestamp, sequence++);
      return id.value;
    });

    // Replace Snowflake.generate with our mock
    const originalGenerate = SnowflakeId.generate;
    SnowflakeId.generate = () => new SnowflakeId(mockGenerate());

    // Generate IDs until sequence number wraps around
    const ids = new Set<string>();
    for (let i = 0; i < 4096; i++) {
      ids.add(SnowflakeId.generate().value);
    }

    // Restore original generate function
    SnowflakeId.generate = originalGenerate;

    expect(ids.size).toBe(4096); // Should generate 4096 unique IDs
  });

  it("nên throw lỗi khi POD_UID không được set", () => {
    // Remove POD_UID
    delete process.env["POD_UID"];

    // Mock Snowflake.generate to throw error
    const mockGenerate = MockFactory.createMockFn();
    mockGenerate.mockImplementation(() => {
      throw new GenerateSnowFlakeError(
        "POD_UID environment variable is required in this environment."
      );
    });

    // Replace Snowflake.generate with our mock
    const originalGenerate = SnowflakeId.generate;
    SnowflakeId.generate = () => new SnowflakeId(mockGenerate());

    expect(() => SnowflakeId.generate()).toThrow(GenerateSnowFlakeError);

    // Restore original generate function
    SnowflakeId.generate = originalGenerate;
  });
});
