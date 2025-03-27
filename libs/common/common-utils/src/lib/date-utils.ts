/**
 * @fileoverview Các utility functions cho date
 * @since 1.0.0
 */

/**
 * Format một date theo định dạng cho trước
 */
export function formatDate(date: Date, format = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Kiểm tra xem một date có hợp lệ không
 */
export function isValidDate(date: unknown): boolean {
  if (!(date instanceof Date)) return false;
  return !isNaN(date.getTime());
}

/**
 * Tạo một date từ string
 */
export function parseDate(dateStr: string): Date | null {
  const date = new Date(dateStr);
  return isValidDate(date) ? date : null;
}

/**
 * Tính số ngày giữa hai date
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffTime / oneDay);
}

/**
 * Thêm số ngày vào một date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Thêm số tháng vào một date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Thêm số năm vào một date
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  const month = result.getMonth();
  const day = result.getDate();
  result.setFullYear(result.getFullYear() + years);
  // Nếu ngày gốc là 29/2 và năm mới không phải nhuận, set về 28/2
  if (month === 1 && day === 29 && result.getMonth() !== 1) {
    result.setMonth(1, 28);
  }
  return result;
}

/**
 * Lấy ngày đầu tiên của tháng
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Lấy ngày cuối cùng của tháng
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Kiểm tra xem một date có nằm trong khoảng thời gian cho trước không
 */
export function isDateBetween(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/**
 * Kiểm tra xem một date có phải là ngày cuối tuần không
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Kiểm tra xem một date có phải là ngày làm việc không
 */
export function isWorkday(date: Date): boolean {
  return !isWeekend(date);
}
