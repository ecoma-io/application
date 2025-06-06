/**
 * @fileoverview Các utility functions cho URL
 * @since 1.0.0
 */

/**
 * Lấy root domain từ hostname.
 * @param {string} hostname - Tên host (ví dụ: sub.example.com)
 * @returns {string} Root domain (ví dụ: example.com)
 * @example
 * getRootDomain('sub.example.com'); // 'example.com'
 * @since 1.0.0
 */
export function getRootDomain(hostname: string): string {
  const parts = hostname.split('.');
  return parts.slice(-2).join('.');
}

/**
 * Lấy query parameters từ một URL
 * @param {string} url - URL cần parse
 * @returns {Record<string, string>} Object chứa các query parameters
 * @example
 * getQueryParams('https://example.com?foo=bar&baz=qux'); // { foo: 'bar', baz: 'qux' }
 * @since 1.0.0
 */
export function getQueryParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url);
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    return {};
  }
}

/**
 * Thêm query parameters vào một URL
 * @param {string} url - URL gốc
 * @param {Record<string, string | number | boolean>} params - Các query parameters cần thêm
 * @returns {string} URL với query parameters đã thêm
 * @example
 * addQueryParams('https://example.com', { foo: 'bar', baz: 123 }); // 'https://example.com?foo=bar&baz=123'
 * @since 1.0.0
 */
export function addQueryParams(url: string, params: Record<string, string | number | boolean>): string {
  try {
    const urlObj = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.append(key, String(value));
    });
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Lấy hostname từ một URL
 * @param {string} url - URL cần parse
 * @returns {string | null} Hostname hoặc null nếu URL không hợp lệ
 * @example
 * getHostname('https://example.com/path'); // 'example.com'
 * @since 1.0.0
 */
export function getHostname(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Kiểm tra xem một URL có phải là URL tuyệt đối không
 * @param {string} url - URL cần kiểm tra
 * @returns {boolean} True nếu là URL tuyệt đối, ngược lại là False
 * @example
 * isAbsoluteUrl('https://example.com'); // true
 * isAbsoluteUrl('/path/to/resource'); // false
 * @since 1.0.0
 */
export function isAbsoluteUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Nối hai phần của một URL
 * @param {string} base - URL gốc
 * @param {string} path - Phần path cần nối
 * @returns {string} URL đã nối
 * @example
 * joinUrl('https://example.com', 'path/to/resource'); // 'https://example.com/path/to/resource'
 * @since 1.0.0
 */
export function joinUrl(base: string, path: string): string {
  try {
    const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
    const pathUrl = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}/${pathUrl}`;
  } catch {
    return base;
  }
}
