import { isPlainObject } from "./type-validation";

/**
 * @fileoverview So sánh sâu hai giá trị
 * @since 1.0.0
 */

/**
 * Hàm helper để so sánh sâu hai giá trị (bao gồm object và array).
 * @param value1 Giá trị thứ nhất.
 * @param value2 Giá trị thứ hai.
 * @returns True nếu hai giá trị bằng nhau về mặt cấu trúc và giá trị, ngược lại là False.
 */
export function deepEqual(value1: unknown, value2: unknown): boolean {
  // So sánh các giá trị nguyên thủy
  if (value1 === value2) {
    return true;
  }

  // Xử lý NaN
  if (Number.isNaN(value1) && Number.isNaN(value2)) {
    return true;
  }

  // Kiểm tra kiểu dữ liệu
  if (typeof value1 !== typeof value2) {
    return false;
  }

  // Xử lý null và undefined
  if (value1 == null || value2 == null) {
    return false;
  }

  // Kiểm tra nếu cả hai là Date objects
  if (value1 instanceof Date && value2 instanceof Date) {
    return value1.getTime() === value2.getTime();
  }

  // Kiểm tra nếu cả hai là RegExp
  if (value1 instanceof RegExp && value2 instanceof RegExp) {
    return value1.toString() === value2.toString();
  }

  // Kiểm tra nếu cả hai là Map
  if (value1 instanceof Map && value2 instanceof Map) {
    if (value1.size !== value2.size) {
      return false;
    }
    for (const [key, value] of value1) {
      if (!value2.has(key) || !deepEqual(value, value2.get(key))) {
        return false;
      }
    }
    return true;
  }

  // Kiểm tra nếu cả hai là Set
  if (value1 instanceof Set && value2 instanceof Set) {
    if (value1.size !== value2.size) {
      return false;
    }
    for (const value of value1) {
      if (!value2.has(value)) {
        return false;
      }
    }
    return true;
  }

  // Kiểm tra nếu cả hai là Array
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false;
    }
    for (let i = 0; i < value1.length; i++) {
      if (!deepEqual(value1[i], value2[i])) {
        return false;
      }
    }
    return true;
  }

  // Kiểm tra nếu cả hai là Plain Object
  if (isPlainObject(value1) && isPlainObject(value2)) {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    // Explicitly cast to Record<string, any> to allow string indexing
    const obj1 = value1 as Record<string, unknown>;
    const obj2 = value2 as Record<string, unknown>;

    for (const key of keys1) {
      if (
        !Object.prototype.hasOwnProperty.call(obj2, key) ||
        !deepEqual(obj1[key], obj2[key])
      ) {
        return false;
      }
    }
    return true;
  }

  // Nếu không rơi vào các trường hợp trên, coi là không bằng nhau
  return false;
}
