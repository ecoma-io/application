import {
  addDays,
  addMonths,
  addYears,
  daysBetween,
  formatDate,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  isDateBetween,
  isValidDate,
  isWeekend,
  isWorkday,
  parseDate,
} from './date-utils';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2024-03-15T10:30:45');
      expect(formatDate(date)).toBe('2024-03-15');
    });

    it('should format date with custom format', () => {
      const date = new Date('2024-03-15T10:30:45');
      expect(formatDate(date, 'YYYY/MM/DD HH:mm:ss')).toBe('2024/03/15 10:30:45');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date', () => {
      expect(isValidDate(new Date())).toBe(true);
    });

    it('should return false for invalid date', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });

    it('should return false for non-date input', () => {
      expect(isValidDate('2024-03-15')).toBe(false);
    });
  });

  describe('parseDate', () => {
    it('should parse valid date string', () => {
      const result = parseDate('2024-03-15');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
      expect(result?.getMonth()).toBe(2); // March is 2 (0-based)
      expect(result?.getDate()).toBe(15);
    });

    it('should return null for invalid date string', () => {
      expect(parseDate('invalid')).toBeNull();
    });
  });

  describe('daysBetween', () => {
    it('should calculate days between two dates', () => {
      const date1 = new Date('2024-03-15');
      const date2 = new Date('2024-03-20');
      expect(daysBetween(date1, date2)).toBe(5);
    });

    it('should handle dates in reverse order', () => {
      const date1 = new Date('2024-03-20');
      const date2 = new Date('2024-03-15');
      expect(daysBetween(date1, date2)).toBe(5);
    });
  });

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2024-03-15');
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should handle negative days', () => {
      const date = new Date('2024-03-15');
      const result = addDays(date, -5);
      expect(result.getDate()).toBe(10);
    });
  });

  describe('addMonths', () => {
    it('should add months to date', () => {
      const date = new Date('2024-03-15');
      const result = addMonths(date, 2);
      expect(result.getMonth()).toBe(4); // May is 4 (0-based)
    });

    it('should handle month overflow', () => {
      const date = new Date('2024-12-15');
      const result = addMonths(date, 2);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1); // February is 1 (0-based)
    });
  });

  describe('addYears', () => {
    it('should add years to date', () => {
      const date = new Date('2024-03-15');
      const result = addYears(date, 2);
      expect(result.getFullYear()).toBe(2026);
    });

    it('should handle leap years', () => {
      const date = new Date('2024-02-29');
      const result = addYears(date, 1);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(28);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('should return first day of month', () => {
      const date = new Date('2024-03-15');
      const result = getFirstDayOfMonth(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(2); // March
      expect(result.getFullYear()).toBe(2024);
    });
  });

  describe('getLastDayOfMonth', () => {
    it('should return last day of month', () => {
      const date = new Date('2024-03-15');
      const result = getLastDayOfMonth(date);
      expect(result.getDate()).toBe(31);
      expect(result.getMonth()).toBe(2); // March
      expect(result.getFullYear()).toBe(2024);
    });

    it('should handle February in leap year', () => {
      const date = new Date('2024-02-15');
      const result = getLastDayOfMonth(date);
      expect(result.getDate()).toBe(29);
    });
  });

  describe('isDateBetween', () => {
    it('should return true for date between range', () => {
      const date = new Date('2024-03-15');
      const start = new Date('2024-03-01');
      const end = new Date('2024-03-31');
      expect(isDateBetween(date, start, end)).toBe(true);
    });

    it('should return false for date outside range', () => {
      const date = new Date('2024-04-01');
      const start = new Date('2024-03-01');
      const end = new Date('2024-03-31');
      expect(isDateBetween(date, start, end)).toBe(false);
    });

    it('should handle inclusive boundaries', () => {
      const date = new Date('2024-03-01');
      const start = new Date('2024-03-01');
      const end = new Date('2024-03-31');
      expect(isDateBetween(date, start, end)).toBe(true);
    });
  });

  describe('isWeekend', () => {
    it('should return true for Saturday', () => {
      const date = new Date('2024-03-16'); // Saturday
      expect(isWeekend(date)).toBe(true);
    });

    it('should return true for Sunday', () => {
      const date = new Date('2024-03-17'); // Sunday
      expect(isWeekend(date)).toBe(true);
    });

    it('should return false for weekday', () => {
      const date = new Date('2024-03-15'); // Friday
      expect(isWeekend(date)).toBe(false);
    });
  });

  describe('isWorkday', () => {
    it('should return true for weekday', () => {
      const date = new Date('2024-03-15'); // Friday
      expect(isWorkday(date)).toBe(true);
    });

    it('should return false for weekend', () => {
      const date = new Date('2024-03-16'); // Saturday
      expect(isWorkday(date)).toBe(false);
    });
  });
});
