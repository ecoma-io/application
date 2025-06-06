/**
 * @fileoverview Các utility functions cho kiểm tra kiểu dữ liệu cơ bản
 * @since 1.0.0
 */

/**
 * Kiểm tra xem một giá trị có phải là null hoặc undefined không
 */
export function isNullOrUndefined(value: unknown): boolean {
  return value === null || value === undefined;
}

/**
 * Kiểm tra xem một giá trị có phải là empty không
 */
export function isEmpty(value: unknown): boolean {
  if (isNullOrUndefined(value)) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length === 0;
  }

  return false;
}

/**
 * Kiểm tra xem một giá trị có phải là number không
 */
export function isNumber(value: unknown): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return !isNaN(num) && isFinite(num);
  }
  return false;
}

/**
 * Kiểm tra xem một giá trị có phải là integer không
 */
export function isInteger(value: unknown): boolean {
  if (typeof value === 'number') {
    return Number.isInteger(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return Number.isInteger(num);
  }
  return false;
}

/**
 * Kiểm tra xem một giá trị có phải là float không
 */
export function isFloat(value: unknown): boolean {
  if (typeof value === 'number') {
    return !Number.isInteger(value) && isFinite(value);
  }
  if (typeof value === 'string') {
    const num = Number(value);
    return !Number.isInteger(num) && isFinite(num);
  }
  return false;
}

/**
 * Kiểm tra xem một giá trị có phải là boolean không
 */
export function isBoolean(value: unknown): boolean {
  return typeof value === 'boolean';
}

/**
 * Kiểm tra xem một giá trị có phải là string không
 */
export function isString(value: unknown): boolean {
  return typeof value === 'string';
}

/**
 * Kiểm tra xem một giá trị có phải là array không
 */
export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

/**
 * Kiểm tra xem một giá trị có phải là object thuần túy không
 */
export function isPlainObject(value: unknown): boolean {
  if (Object.prototype.toString.call(value) !== '[object Object]') return false;
  if (value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Kiểm tra xem một giá trị có phải là function không
 */
export function isFunction(value: unknown): boolean {
  return typeof value === 'function';
}

/**
 * Kiểm tra xem một giá trị có phải là date không
 */
export function isDate(value: unknown): boolean {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Kiểm tra xem một giá trị có phải là regexp không
 */
export function isRegExp(value: unknown): boolean {
  return value instanceof RegExp;
}

/**
 * Kiểm tra xem một giá trị có phải là error không
 */
export function isError(value: unknown): boolean {
  return value instanceof Error;
}

/**
 * Kiểm tra xem một giá trị có phải là promise không
 */
export function isPromise(value: unknown): boolean {
  return (
    value instanceof Promise ||
    (typeof value === 'object' && value !== null && 'then' in value && typeof (value as { then: unknown }).then === 'function')
  );
}
