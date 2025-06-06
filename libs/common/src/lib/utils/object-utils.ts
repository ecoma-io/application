/**
 * @fileoverview Các utility functions cho object
 * @since 1.0.0
 */

/**
 * Tạo một deep copy của object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const copy = {} as Record<string, unknown>;
    Object.keys(obj).forEach((key) => {
      copy[key] = deepClone((obj as Record<string, unknown>)[key]);
    });
    return copy as T;
  }

  return obj;
}

/**
 * Merge hai object
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = target[key];
      if (isObject(sourceValue) && isObject(targetValue)) {
        (output as Record<string, unknown>)[key] = deepMerge(targetValue as Record<string, unknown>, sourceValue as Record<string, unknown>);
      } else {
        (output as Record<string, unknown>)[key] = sourceValue;
      }
    });
  }
  return output as T;
}

/**
 * Kiểm tra xem một giá trị có phải là object không
 */
export function isObject(item: unknown): boolean {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Lấy giá trị của một property từ object theo path
 */
export function get<T>(obj: Record<string, unknown>, path: string, defaultValue?: T): T | undefined {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res: unknown, key: string) => {
        if (res === null || res === undefined) return res;
        if (typeof res === 'object') {
          return (res as Record<string, unknown>)[key];
        }
        return undefined;
      }, obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : (result as T);
}

/**
 * Set giá trị cho một property của object theo path
 */
export function set<T extends Record<string, unknown>>(obj: T, path: string | string[], value: unknown): T {
  if (Object(obj) !== obj) return obj;
  const pathArray = Array.isArray(path) ? path : path.toString().match(/[^.[\]]+/g) || [];

  const result = pathArray.slice(0, -1).reduce((a: Record<string, unknown>, c: string, i: number) => {
    if (Object(a[c]) === a[c]) {
      if (!Array.isArray(a[c])) a[c] = {};
    } else {
      a[c] = Math.abs(Number(pathArray[i + 1])) >> 0 === +pathArray[i + 1] ? [] : {};
    }
    return a[c] as Record<string, unknown>;
  }, obj);

  result[pathArray[pathArray.length - 1]] = value;
  return obj;
}

/**
 * Xóa một property từ object theo path
 */
export function unset(obj: Record<string, unknown>, path: string | string[]): boolean {
  if (Object(obj) !== obj) return false;
  const pathArray = Array.isArray(path) ? path : path.toString().match(/[^.[\]]+/g) || [];

  let current = obj;
  for (let i = 0; i < pathArray.length - 1; i++) {
    if (!(pathArray[i] in current)) {
      return false;
    }
    current = current[pathArray[i]] as Record<string, unknown>;
    if (!isObject(current)) {
      return false;
    }
  }

  const lastKey = pathArray[pathArray.length - 1];
  if (!(lastKey in current)) {
    return false;
  }

  delete current[lastKey];
  return true;
}

/**
 * Lấy tất cả các keys của object theo path
 */
export function keys(obj: Record<string, unknown>, path = ''): string[] {
  return Object.keys(obj).reduce((acc: string[], key) => {
    const newPath = path ? `${path}.${key}` : key;
    const value = obj[key];
    if (Array.isArray(value)) {
      return [
        ...acc,
        ...value
          .map((_, index) => {
            const arrayPath = `${newPath}[${index}]`;
            if (isObject(value[index])) {
              return keys(value[index] as Record<string, unknown>, arrayPath);
            }
            return arrayPath;
          })
          .flat(),
      ];
    }
    if (isObject(value)) {
      return [...acc, ...keys(value as Record<string, unknown>, newPath)];
    }
    return [...acc, newPath];
  }, []);
}

/**
 * Lấy tất cả các values của object theo path
 */
export function values(obj: Record<string, unknown>): unknown[] {
  return Object.keys(obj).map((key) => obj[key]);
}

/**
 * Lấy tất cả các entries của object theo path
 */
export function entries(obj: Record<string, unknown>): [string, unknown][] {
  return Object.keys(obj).map((key) => [key, obj[key]]);
}

/**
 * Tạo một object từ array các entries
 */
export function fromEntries(entries: [string, unknown][]): Record<string, unknown> {
  return entries.reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {} as Record<string, unknown>);
}

/**
 * Tạo một object từ array các keys và values
 */
export function zipObject(keys: string[], values: unknown[]): Record<string, unknown> {
  return keys.reduce((obj, key, index) => {
    obj[key] = values[index];
    return obj;
  }, {} as Record<string, unknown>);
}
