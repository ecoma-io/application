import { EmailAddress } from './email-address.vo';

describe('EmailAddress', () => {
  describe('create', () => {
    it('nên tạo một EmailAddress hợp lệ', () => {
      // Arrange & Act
      const email = EmailAddress.create('test@example.com');

      // Assert
      expect(email).toBeDefined();
      expect(email.value).toBe('test@example.com');
    });

    it('nên chuyển đổi email sang chữ thường', () => {
      // Arrange & Act
      const email = EmailAddress.create('Test@Example.com');

      // Assert
      expect(email.value).toBe('test@example.com');
    });

    it('nên ném lỗi khi email không được cung cấp', () => {
      // Arrange, Act & Assert
      expect(() => {
        EmailAddress.create('');
      }).toThrow();

      expect(() => {
        EmailAddress.create(null as unknown as string);
      }).toThrow();

      expect(() => {
        EmailAddress.create(undefined as unknown as string);
      }).toThrow();
    });

    it('nên ném lỗi khi định dạng email không hợp lệ', () => {
      // Arrange, Act & Assert
      expect(() => {
        EmailAddress.create('invalid-email');
      }).toThrow();

      expect(() => {
        EmailAddress.create('test@');
      }).toThrow();

      expect(() => {
        EmailAddress.create('@example.com');
      }).toThrow();

      expect(() => {
        EmailAddress.create('test@example');
      }).toThrow();
    });
  });
});
