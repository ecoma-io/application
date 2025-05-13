import { User } from '@ecoma/iam-domain';
import { UserMapper } from './user.mapper';
import { IUserDto } from '../dtos/user.dto';

describe('UserMapper', () => {
  describe('toDto', () => {
    it('nên chuyển đổi User domain thành DTO chính xác', () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: { value: 'test@example.com' },
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          locale: 'en-US',
        },
        status: { value: 'Active' },
      } as unknown as User;

      // Act
      const result: IUserDto = UserMapper.toDto(mockUser);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('user-123');
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.locale).toBe('en-US');
      expect(result.status).toBe('Active');
    });
  });

  describe('toPersistence', () => {
    it('nên chuyển đổi User domain thành đối tượng persistence chính xác', () => {
      // Arrange
      const now = new Date();
      const mockUser = {
        id: 'user-123',
        email: { value: 'test@example.com' },
        passwordHash: { value: 'hashed_password' },
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          locale: 'en-US',
        },
        status: { value: 'Active' },
        passwordResetToken: 'reset-token',
        passwordResetTokenExpiresAt: new Date(now.getTime() + 3600000),
        emailVerificationToken: 'verify-token',
        emailVerificationTokenExpiresAt: new Date(now.getTime() + 3600000),
        createdAt: now,
        updatedAt: now,
      } as unknown as User;

      // Act
      const result = UserMapper.toPersistence(mockUser);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('user-123');
      expect(result.email).toBe('test@example.com');
      expect(result.password_hash).toBe('hashed_password');
      expect(result.first_name).toBe('John');
      expect(result.last_name).toBe('Doe');
      expect(result.locale).toBe('en-US');
      expect(result.status).toBe('Active');
      expect(result.password_reset_token).toBe('reset-token');
      expect(result.password_reset_token_expires_at).toEqual(mockUser.passwordResetTokenExpiresAt);
      expect(result.email_verification_token).toBe('verify-token');
      expect(result.email_verification_token_expires_at).toEqual(mockUser.emailVerificationTokenExpiresAt);
      expect(result.created_at).toBe(now);
      expect(result.updated_at).toBe(now);
    });

    it('nên xử lý đúng các trường tùy chọn khi chúng không tồn tại', () => {
      // Arrange
      const now = new Date();
      const mockUser = {
        id: 'user-123',
        email: { value: 'test@example.com' },
        passwordHash: { value: 'hashed_password' },
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          locale: 'en-US',
        },
        status: { value: 'Active' },
        passwordResetToken: undefined,
        passwordResetTokenExpiresAt: undefined,
        emailVerificationToken: undefined,
        emailVerificationTokenExpiresAt: undefined,
        createdAt: now,
        updatedAt: now,
      } as unknown as User;

      // Act
      const result = UserMapper.toPersistence(mockUser);

      // Assert
      expect(result).toBeDefined();
      expect(result.password_reset_token).toBeUndefined();
      expect(result.password_reset_token_expires_at).toBeUndefined();
      expect(result.email_verification_token).toBeUndefined();
      expect(result.email_verification_token_expires_at).toBeUndefined();
    });
  });
});
