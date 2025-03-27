/**
 * @fileoverview Các utility functions cho string
 * @since 1.0.0
 */

/**
 * Kiểm tra xem một chuỗi có phải là email hợp lệ không
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Kiểm tra xem một chuỗi có phải là URL hợp lệ không
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Kiểm tra xem một chuỗi có phải là số điện thoại hợp lệ không
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{9,13}$/;
  return phoneRegex.test(phone);
}

/**
 * Format một chuỗi theo template
 */
export function formatString(template: string, ...args: unknown[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return args[index] !== undefined ? String(args[index]) : match;
  });
}

/**
 * Tạo một slug từ chuỗi
 */
export function createSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Tạo một chuỗi ngẫu nhiên với độ dài cho trước
 */
export function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Truncate một chuỗi với độ dài cho trước
 */
export function truncateString(
  str: string,
  length: number,
  suffix = "..."
): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
}

/**
 * Capitalize chữ cái đầu tiên của chuỗi
 */
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert một chuỗi thành camelCase
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

/**
 * Convert một chuỗi thành snake_case
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/_$/, "");
}

/**
 * Convert một chuỗi thành kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .replace(/^-/, "")
    .replace(/-$/, "");
}

/**
 * Convert một chuỗi thành PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

/**
 * Đếm số lần xuất hiện của một chuỗi con trong chuỗi
 */
export function countOccurrences(str: string, searchStr: string): number {
  if (searchStr.length === 0) return 0;
  let count = 0;
  let position = 0;
  while (true) {
    position = str.indexOf(searchStr, position);
    if (position === -1) break;
    count++;
    position += searchStr.length;
  }
  return count;
}

/**
 * Đảo ngược một chuỗi
 */
export function reverseString(str: string): string {
  return str.split("").reverse().join("");
}

/**
 * Loại bỏ các ký tự không mong muốn khỏi chuỗi
 */
export function stripChars(str: string, chars: string): string {
  const regex = new RegExp(`[${chars}]`, "g");
  return str.replace(regex, "");
}
