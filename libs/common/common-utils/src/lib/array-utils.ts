/**
 * @fileoverview Các utility functions cho array
 * @since 1.0.0
 */

/**
 * Chia một array thành các chunks với kích thước cho trước
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Lấy các phần tử duy nhất từ một array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Lấy các phần tử duy nhất từ một array dựa trên một key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

/**
 * Lấy các phần tử chung giữa hai array
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => array2.includes(item));
}

/**
 * Lấy các phần tử chung giữa hai array dựa trên một key
 */
export function intersectionBy<T>(array1: T[], array2: T[], key: keyof T): T[] {
  const set = new Set(array2.map(item => item[key]));
  return array1.filter(item => set.has(item[key]));
}

/**
 * Lấy các phần tử khác nhau giữa hai array
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  return array1.filter(item => !array2.includes(item));
}

/**
 * Lấy các phần tử khác nhau giữa hai array dựa trên một key
 */
export function differenceBy<T>(array1: T[], array2: T[], key: keyof T): T[] {
  const set = new Set(array2.map(item => item[key]));
  return array1.filter(item => !set.has(item[key]));
}

/**
 * Lấy các phần tử đầu tiên của array
 */
export function first<T>(array: T[]): T | undefined {
  return array[0];
}

/**
 * Lấy các phần tử cuối cùng của array
 */
export function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

/**
 * Lấy một phần tử ngẫu nhiên từ array
 */
export function random<T>(array: T[]): T | undefined {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Lấy một số phần tử ngẫu nhiên từ array
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Kiểm tra xem một array có chứa tất cả các phần tử của array khác không
 */
export function includesAll<T>(array: T[], items: T[]): boolean {
  return items.every(item => array.includes(item));
}

/**
 * Kiểm tra xem một array có chứa bất kỳ phần tử nào của array khác không
 */
export function includesAny<T>(array: T[], items: T[]): boolean {
  return items.some(item => array.includes(item));
}

/**
 * Tạo một array với số lượng phần tử cho trước
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}
