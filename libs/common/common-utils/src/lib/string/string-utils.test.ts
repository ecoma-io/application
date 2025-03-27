import {
  isValidEmail,
  isValidUrl,
  isValidPhoneNumber,
  formatString,
  createSlug,
  generateRandomString,
  truncateString,
  capitalizeFirstLetter,
  toCamelCase,
  toSnakeCase,
} from './string-utils';

describe('String Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail('test example.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://sub.example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com:8080/path?query=value')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('https://')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should validate correct phone numbers', () => {
      expect(isValidPhoneNumber('+1234567890')).toBe(true);
      expect(isValidPhoneNumber('1234567890')).toBe(true);
      expect(isValidPhoneNumber('+12345678901234')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false);
      expect(isValidPhoneNumber('abc')).toBe(false);
      expect(isValidPhoneNumber('+123456789012345')).toBe(false);
    });
  });

  describe('formatString', () => {
    it('should format string with arguments', () => {
      expect(formatString('Hello {0}!', 'World')).toBe('Hello World!');
      expect(formatString('{0} + {1} = {2}', 1, 2, 3)).toBe('1 + 2 = 3');
    });

    it('should keep placeholders if arguments are missing', () => {
      expect(formatString('Hello {0}!')).toBe('Hello {0}!');
      expect(formatString('{0} + {1} = {2}', 1)).toBe('1 + {1} = {2}');
    });
  });

  describe('createSlug', () => {
    it('should create valid slugs', () => {
      expect(createSlug('Hello World')).toBe('hello-world');
      expect(createSlug('Hello & World')).toBe('hello-world');
      expect(createSlug('Hello-World')).toBe('hello-world');
      expect(createSlug('Hello_World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(createSlug('Hello! @World#')).toBe('hello-world');
      expect(createSlug('Hello (World)')).toBe('hello-world');
    });

    it('should handle multiple spaces and special characters', () => {
      expect(createSlug('Hello   World')).toBe('hello-world');
      expect(createSlug('Hello---World')).toBe('hello-world');
      expect(createSlug('Hello___World')).toBe('hello-world');
    });
  });

  describe('generateRandomString', () => {
    it('should generate string of specified length', () => {
      const length = 10;
      const result = generateRandomString(length);
      expect(result.length).toBe(length);
      expect(result).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should generate different strings on each call', () => {
      const result1 = generateRandomString(10);
      const result2 = generateRandomString(10);
      expect(result1).not.toBe(result2);
    });
  });

  describe('truncateString', () => {
    it('should truncate string to specified length', () => {
      expect(truncateString('Hello World', 5)).toBe('Hello...');
      expect(truncateString('Hello World', 10)).toBe('Hello Worl...');
    });

    it('should not truncate if string is shorter than length', () => {
      expect(truncateString('Hello', 10)).toBe('Hello');
    });

    it('should use custom suffix', () => {
      expect(truncateString('Hello World', 5, '***')).toBe('Hello***');
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should capitalize first letter', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('world')).toBe('World');
    });

    it('should handle empty string', () => {
      expect(capitalizeFirstLetter('')).toBe('');
    });

    it('should handle already capitalized string', () => {
      expect(capitalizeFirstLetter('Hello')).toBe('Hello');
    });
  });

  describe('toCamelCase', () => {
    it('should convert to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('Hello World')).toBe('helloWorld');
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });

    it('should handle single word', () => {
      expect(toCamelCase('hello')).toBe('hello');
      expect(toCamelCase('Hello')).toBe('hello');
    });
  });

  describe('toSnakeCase', () => {
    it('should convert to snake_case', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
      expect(toSnakeCase('Hello World')).toBe('hello_world');
      expect(toSnakeCase('hello-world')).toBe('hello_world');
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
    });

    it('should handle single word', () => {
      expect(toSnakeCase('hello')).toBe('hello');
      expect(toSnakeCase('Hello')).toBe('hello');
    });
  });
});
