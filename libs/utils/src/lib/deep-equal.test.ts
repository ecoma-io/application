/**
 * @fileoverview Unit test cho hàm deepEqual
 * @since 1.0.0
 */

import { deepEqual } from "./deep-equal";

describe("deepEqual", () => {
  describe("primitive values", () => {
    it("nên trả về true cho các giá trị nguyên thủy bằng nhau", () => {
      // Act & Assert
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual("test", "test")).toBe(true);
      expect(deepEqual(true, true)).toBe(true);
      expect(deepEqual(null, null)).toBe(true);
      expect(deepEqual(undefined, undefined)).toBe(true);
      expect(deepEqual(NaN, NaN)).toBe(true);
    });

    it("nên trả về false cho các giá trị nguyên thủy khác nhau", () => {
      // Act & Assert
      expect(deepEqual(1, 2)).toBe(false);
      expect(deepEqual("test", "test2")).toBe(false);
      expect(deepEqual(true, false)).toBe(false);
      expect(deepEqual(null, undefined)).toBe(false);
      expect(deepEqual(0, false)).toBe(false);
      expect(deepEqual("", false)).toBe(false);
    });
  });

  describe("objects", () => {
    it("nên trả về true cho các đối tượng thuần túy bằng nhau", () => {
      // Act & Assert
      expect(deepEqual({}, {})).toBe(true);
      expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
      expect(deepEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } })).toBe(
        true
      );
      expect(deepEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
      expect(deepEqual(Object.create(null), Object.create(null))).toBe(true);
    });

    it("nên trả về false cho các đối tượng thuần túy khác nhau", () => {
      // Act & Assert
      expect(deepEqual({}, { a: 1 })).toBe(false);
      expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(deepEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
      expect(deepEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 4 } })).toBe(
        false
      );
      expect(deepEqual({ a: [1, 2] }, { a: [1, 3] })).toBe(false);
      expect(deepEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false);
    });
  });

  describe("arrays", () => {
    it("nên trả về true cho các mảng bằng nhau", () => {
      // Act & Assert
      expect(deepEqual([], [])).toBe(true);
      expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    });

    it("nên trả về false cho các mảng khác nhau", () => {
      // Act & Assert
      expect(deepEqual([], [1])).toBe(false);
      expect(deepEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(deepEqual([1, [2, 3]], [1, [2, 4]])).toBe(false);
    });
  });

  describe("special objects", () => {
    it("nên xử lý đúng các đối tượng đặc biệt", () => {
      // Arrange
      const date1 = new Date("2023-01-01");
      const date2 = new Date("2023-01-01");
      const date3 = new Date("2023-01-02");
      const regex1 = /test/;
      const regex2 = /test/;
      const regex3 = /test2/;
      const map1 = new Map([["a", 1]]);
      const map2 = new Map([["a", 1]]);
      const map3 = new Map([["a", 2]]);
      const set1 = new Set([1, 2, 3]);
      const set2 = new Set([1, 2, 3]);
      const set3 = new Set([1, 2, 4]);

      // Act & Assert
      expect(deepEqual(date1, date2)).toBe(true);
      expect(deepEqual(date1, date3)).toBe(false);
      expect(deepEqual(regex1, regex2)).toBe(true);
      expect(deepEqual(regex1, regex3)).toBe(false);
      expect(deepEqual(map1, map2)).toBe(true);
      expect(deepEqual(map1, map3)).toBe(false);
      expect(deepEqual(set1, set2)).toBe(true);
      expect(deepEqual(set1, set3)).toBe(false);
    });
  });
});
