/**
 * @fileoverview Các utility functions cho kiểm tra định dạng dữ liệu
 * @since 1.0.0
 */

/**
 * Kiểm tra xem một giá trị có phải là credit card number không
 */
export function isCreditCardNumber(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Loại bỏ khoảng trắng và dấu gạch ngang
  const sanitized = value.replace(/[\s-]/g, "");

  // Kiểm tra xem chuỗi chỉ chứa số và có độ dài hợp lệ (13-19 chữ số)
  if (!/^\d{13,19}$/.test(sanitized)) {
    return false;
  }

  // Thuật toán Luhn
  let sum = 0;
  let double = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (double) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    double = !double;
  }

  return sum % 10 === 0;
}

/**
 * Kiểm tra xem một giá trị có phải là hex color không
 */
export function isHexColor(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  return /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
}

/**
 * Kiểm tra xem một giá trị có phải là rgb color không
 */
export function isRgbColor(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Kiểm tra định dạng rgb(r,g,b) và đảm bảo các giá trị từ 0-255
  const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
  const match = value.match(rgbRegex);

  if (!match) {
    return false;
  }

  // Kiểm tra giá trị RGB trong khoảng 0-255
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);

  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
}

/**
 * Kiểm tra xem một giá trị có phải là rgba color không
 */
export function isRgbaColor(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Kiểm tra định dạng rgba(r,g,b,a) và đảm bảo các giá trị hợp lệ
  const rgbaRegex =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([0-9]*\.?[0-9]+)\s*\)$/;
  const match = value.match(rgbaRegex);

  if (!match) {
    return false;
  }

  // Kiểm tra giá trị RGB trong khoảng 0-255
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  const a = parseFloat(match[4]);

  return (
    r >= 0 &&
    r <= 255 &&
    g >= 0 &&
    g <= 255 &&
    b >= 0 &&
    b <= 255 &&
    a >= 0 &&
    a <= 1
  );
}

/**
 * Kiểm tra xem một giá trị có phải là hsl color không
 */
export function isHslColor(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Kiểm tra định dạng hsl(h,s%,l%) và đảm bảo các giá trị hợp lệ
  const hslRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
  const match = value.match(hslRegex);

  if (!match) {
    return false;
  }

  // Kiểm tra giá trị H trong khoảng 0-360, S và L trong khoảng 0-100
  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);

  return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
}

/**
 * Kiểm tra xem một giá trị có phải là hsla color không
 */
export function isHslaColor(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Kiểm tra định dạng hsla(h,s%,l%,a) và đảm bảo các giá trị hợp lệ
  const hslaRegex =
    /^hsla\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([0-9]*\.?[0-9]+)\s*\)$/;
  const match = value.match(hslaRegex);

  if (!match) {
    return false;
  }

  // Kiểm tra giá trị H trong khoảng 0-360, S và L trong khoảng 0-100, A trong khoảng 0-1
  const h = parseInt(match[1], 10);
  const s = parseInt(match[2], 10);
  const l = parseInt(match[3], 10);
  const a = parseFloat(match[4]);

  return (
    h >= 0 &&
    h <= 360 &&
    s >= 0 &&
    s <= 100 &&
    l >= 0 &&
    l <= 100 &&
    a >= 0 &&
    a <= 1
  );
}

/**
 * Kiểm tra xem một giá trị có phải là base64 không
 */
export function isBase64(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Kiểm tra chuỗi có phải là base64 hợp lệ không
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(value)) {
    return false;
  }

  // Kiểm tra độ dài
  const length = value.length;
  if (length % 4 !== 0) {
    return false;
  }

  // Kiểm tra padding
  const paddingLength =
    value.indexOf("=") !== -1 ? value.length - value.indexOf("=") : 0;
  return paddingLength <= 2;
}

/**
 * Kiểm tra xem một giá trị có phải là JSON string không
 */
export function isJsonString(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  try {
    const result = JSON.parse(value);
    return typeof result === "object" && result !== null;
  } catch {
    return false;
  }
}

/**
 * Kiểm tra xem một giá trị có phải là UUID không
 */
export function isUuid(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

/**
 * Kiểm tra xem một giá trị có phải là ip address không
 */
export function isIpAddress(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }
  // IPv4
  const ipv4 = value.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/);
  if (ipv4) {
    const parts = value.split(".").map(Number);
    if (parts.length !== 4) return false;
    return parts.every((part) => part >= 0 && part <= 255);
  }
  // IPv6
  const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(value);
  return ipv6;
}
