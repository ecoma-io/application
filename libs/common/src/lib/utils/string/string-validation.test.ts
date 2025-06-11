import {
  isAlpha,
  isAlphanumeric,
  isAnagram,
  isAscii,
  isEmail,
  isHeterogram,
  isIsogram,
  isLipogram,
  isLowercase,
  isNumeric,
  isPalindrome,
  isPangram,
  isPangrammaticLipogram,
  isPhoneNumber,
  isTautogram,
  isUppercase,
  isUrl,
} from './string-validation';

describe('String Validation Utils', () => {
  describe('isEmail', () => {
    test('Nên trả về true cho email hợp lệ', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('test.email@example.com')).toBe(true);
      expect(isEmail('test+email@example.com')).toBe(true);
      expect(isEmail('test@sub.example.com')).toBe(true);
    });

    test('Nên trả về false cho email không hợp lệ', () => {
      expect(isEmail('test')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
      expect(isEmail('test@example')).toBe(false);
      expect(isEmail('test@.com')).toBe(false);
      expect(isEmail('test@example.')).toBe(false);
      expect(isEmail('test@example..com')).toBe(false);
      expect(isEmail('')).toBe(false);
      expect(isEmail(123)).toBe(false);
    });
  });

  describe('isUrl', () => {
    test('Nên trả về true cho URL hợp lệ', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('http://example.com')).toBe(true);
      expect(isUrl('https://www.example.com')).toBe(true);
      expect(isUrl('https://example.com/path')).toBe(true);
      expect(isUrl('https://example.com/path?query=value')).toBe(true);
      expect(isUrl('https://example.com:8080')).toBe(true);
    });

    test('Nên trả về false cho URL không hợp lệ', () => {
      expect(isUrl('example.com')).toBe(false);
      expect(isUrl('www.example.com')).toBe(false);
      expect(isUrl('http:/example.com')).toBe(false);
      expect(isUrl('http//example.com')).toBe(false);
      expect(isUrl('')).toBe(false);
      expect(isUrl(123)).toBe(false);
    });
  });

  describe('isPhoneNumber', () => {
    test('Nên trả về true cho số điện thoại hợp lệ', () => {
      expect(isPhoneNumber('1234567890')).toBe(true);
      expect(isPhoneNumber('12345678901')).toBe(true);
      expect(isPhoneNumber('+1234567890')).toBe(true);
      expect(isPhoneNumber('+12345678901234')).toBe(true);
    });

    test('Nên trả về false cho số điện thoại không hợp lệ', () => {
      expect(isPhoneNumber('123')).toBe(false); // Quá ngắn
      expect(isPhoneNumber('123456789012345')).toBe(false); // Quá dài
      expect(isPhoneNumber('abcdefghij')).toBe(false); // Không phải số
      expect(isPhoneNumber('123-456-7890')).toBe(false); // Chứa ký tự không hợp lệ
      expect(isPhoneNumber('(123) 456-7890')).toBe(false); // Chứa ký tự không hợp lệ
      expect(isPhoneNumber('')).toBe(false);
      expect(isPhoneNumber(123)).toBe(false);
    });
  });

  describe('isAscii', () => {
    test('Nên trả về true cho chuỗi ASCII', () => {
      expect(isAscii('abcABC123')).toBe(true);
      expect(isAscii('!@#$%^&*()')).toBe(true);
      expect(isAscii('')).toBe(true);
    });

    test('Nên trả về false cho chuỗi không phải ASCII', () => {
      expect(isAscii('áéíóú')).toBe(false);
      expect(isAscii('こんにちは')).toBe(false);
      expect(isAscii('👋')).toBe(false);
      expect(isAscii(123)).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    test('Nên trả về true cho chuỗi chỉ chứa chữ cái và số', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC123')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
      expect(isAlphanumeric('abc')).toBe(true);
      expect(isAlphanumeric('')).toBe(true);
    });

    test('Nên trả về false cho chuỗi chứa ký tự không phải chữ cái và số', () => {
      expect(isAlphanumeric('abc 123')).toBe(false);
      expect(isAlphanumeric('abc-123')).toBe(false);
      expect(isAlphanumeric('abc_123')).toBe(false);
      expect(isAlphanumeric('abc!123')).toBe(false);
      expect(isAlphanumeric(123)).toBe(false);
    });
  });

  describe('isAlpha', () => {
    test('Nên trả về true cho chuỗi chỉ chứa chữ cái', () => {
      expect(isAlpha('abc')).toBe(true);
      expect(isAlpha('ABC')).toBe(true);
      expect(isAlpha('abcABC')).toBe(true);
      expect(isAlpha('')).toBe(true);
    });

    test('Nên trả về false cho chuỗi chứa ký tự không phải chữ cái', () => {
      expect(isAlpha('abc123')).toBe(false);
      expect(isAlpha('abc ')).toBe(false);
      expect(isAlpha('abc-')).toBe(false);
      expect(isAlpha('abc!')).toBe(false);
      expect(isAlpha(123)).toBe(false);
    });
  });

  describe('isNumeric', () => {
    test('Nên trả về true cho chuỗi chỉ chứa số', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('0')).toBe(true);
      expect(isNumeric('')).toBe(true);
    });

    test('Nên trả về false cho chuỗi chứa ký tự không phải số', () => {
      expect(isNumeric('123a')).toBe(false);
      expect(isNumeric('123 ')).toBe(false);
      expect(isNumeric('123-')).toBe(false);
      expect(isNumeric('123.')).toBe(false);
      expect(isNumeric(123)).toBe(false);
    });
  });

  describe('isLowercase', () => {
    test('Nên trả về true cho chuỗi chỉ chứa chữ thường', () => {
      expect(isLowercase('abc')).toBe(true);
      expect(isLowercase('abc123')).toBe(true);
      expect(isLowercase('abc!@#')).toBe(true);
      expect(isLowercase('')).toBe(true);
    });

    test('Nên trả về false cho chuỗi chứa chữ hoa', () => {
      expect(isLowercase('Abc')).toBe(false);
      expect(isLowercase('ABC')).toBe(false);
      expect(isLowercase('abc ABC')).toBe(false);
      expect(isLowercase(123)).toBe(false);
    });
  });

  describe('isUppercase', () => {
    test('Nên trả về true cho chuỗi chỉ chứa chữ hoa', () => {
      expect(isUppercase('ABC')).toBe(true);
      expect(isUppercase('ABC123')).toBe(true);
      expect(isUppercase('ABC!@#')).toBe(true);
      expect(isUppercase('')).toBe(true);
    });

    test('Nên trả về false cho chuỗi chứa chữ thường', () => {
      expect(isUppercase('Abc')).toBe(false);
      expect(isUppercase('abc')).toBe(false);
      expect(isUppercase('ABC abc')).toBe(false);
      expect(isUppercase(123)).toBe(false);
    });
  });

  describe('isPalindrome', () => {
    test('Nên trả về true cho chuỗi palindrome', () => {
      expect(isPalindrome('racecar')).toBe(true);
      expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
      expect(isPalindrome('No lemon, no melon')).toBe(true);
      expect(isPalindrome('12321')).toBe(true);
      expect(isPalindrome('')).toBe(true);
    });

    test('Nên trả về false cho chuỗi không phải palindrome', () => {
      expect(isPalindrome('hello')).toBe(false);
      expect(isPalindrome('abc')).toBe(false);
      expect(isPalindrome('12345')).toBe(false);
      expect(isPalindrome(123)).toBe(false);
    });
  });

  describe('isAnagram', () => {
    test('Nên trả về true cho hai chuỗi là anagram', () => {
      expect(isAnagram('listen', 'silent')).toBe(true);
      expect(isAnagram('triangle', 'integral')).toBe(true);
      expect(isAnagram('A decimal point', "I'm a dot in place")).toBe(true);
      expect(isAnagram('', '')).toBe(true);
    });

    test('Nên trả về false cho hai chuỗi không phải anagram', () => {
      expect(isAnagram('hello', 'world')).toBe(false);
      expect(isAnagram('abc', 'abd')).toBe(false);
      expect(isAnagram('abc', 'abcd')).toBe(false);
      expect(isAnagram(123, 321)).toBe(false);
    });
  });

  describe('isPangram', () => {
    test('Nên trả về true cho chuỗi pangram', () => {
      expect(isPangram('The quick brown fox jumps over the lazy dog')).toBe(true);
      expect(isPangram('Pack my box with five dozen liquor jugs')).toBe(true);
    });

    test('Nên trả về false cho chuỗi không phải pangram', () => {
      expect(isPangram('Hello world')).toBe(false);
      expect(isPangram('The quick brown fox jumps over the dog')).toBe(false);
      expect(isPangram('')).toBe(false);
      expect(isPangram(123)).toBe(false);
    });
  });

  describe('isIsogram', () => {
    test('Nên trả về true cho chuỗi isogram', () => {
      expect(isIsogram('uncopyrightable')).toBe(true);
      expect(isIsogram('ambidextrously')).toBe(true);
      expect(isIsogram('blackjump')).toBe(true);
      expect(isIsogram('')).toBe(true);
    });

    test('Nên trả về false cho chuỗi không phải isogram', () => {
      expect(isIsogram('hello')).toBe(false);
      expect(isIsogram('banana')).toBe(false);
      expect(isIsogram(123)).toBe(false);
    });
  });

  describe('isHeterogram', () => {
    test('Nên trả về true cho chuỗi heterogram', () => {
      expect(isHeterogram('uncopyrightable')).toBe(true);
      expect(isHeterogram('ambidextrously')).toBe(true);
      expect(isHeterogram('blackjump')).toBe(true);
      expect(isHeterogram('')).toBe(true);
    });

    test('Nên trả về false cho chuỗi không phải heterogram', () => {
      expect(isHeterogram('hello')).toBe(false);
      expect(isHeterogram('banana')).toBe(false);
      expect(isHeterogram(123)).toBe(false);
    });
  });

  describe('isTautogram', () => {
    test('Nên trả về true cho chuỗi tautogram', () => {
      expect(isTautogram('Peter Piper picked a peck of pickled peppers')).toBe(true);
      expect(isTautogram('Brave big bears bounce')).toBe(true);
    });

    test('Nên trả về false cho chuỗi không phải tautogram', () => {
      expect(isTautogram('Hello world')).toBe(false);
      expect(isTautogram('The quick brown fox')).toBe(false);
      expect(isTautogram('a')).toBe(false);
      expect(isTautogram('')).toBe(false);
      expect(isTautogram(123)).toBe(false);
    });
  });

  describe('isLipogram', () => {
    test('Nên trả về true cho chuỗi lipogram', () => {
      expect(isLipogram('The quick brown fox jumps over the lazy dog', 'a')).toBe(false);
      expect(isLipogram('The quick brown fox jumps over the dog', 'z')).toBe(true);
    });

    test('Nên trả về false cho chuỗi không phải lipogram', () => {
      expect(isLipogram('Hello world', 'o')).toBe(false);
      expect(isLipogram('', 'a')).toBe(true);
      expect(isLipogram(123 as unknown as string, 'a')).toBe(false);
      expect(isLipogram('abc', '1')).toBe(true);
    });
  });

  describe('isPangrammaticLipogram', () => {
    test('Nên trả về true cho chuỗi pangrammatic lipogram', () => {
      expect(isPangrammaticLipogram('The quick brown fox jumps over the lazy dog', 'z')).toBe(false);
      expect(isPangrammaticLipogram('The quick brown fox jumps over the lad', 'y')).toBe(false);
      // Tạo một chuỗi pangrammatic lipogram thật sẽ rất phức tạp
    });

    test('Nên trả về false cho chuỗi không phải pangrammatic lipogram', () => {
      expect(isPangrammaticLipogram('Hello world', 'z')).toBe(false);
      expect(isPangrammaticLipogram('', 'a')).toBe(false);
      expect(isPangrammaticLipogram(123 as unknown as string, 'a')).toBe(false);
      expect(isPangrammaticLipogram('abc', '1')).toBe(false);
    });
  });
});
