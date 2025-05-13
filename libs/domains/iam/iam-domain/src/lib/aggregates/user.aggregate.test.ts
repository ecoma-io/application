import { User } from './user.aggregate';
import { EmailAddress } from '../value-objects/email-address.vo';
import { PasswordHash } from '../value-objects/password-hash.vo';
import { UserStatusValues } from '../value-objects/user-status.vo';
import { UserProfile } from '../value-objects/user-profile.vo';

describe('User Aggregate', () => {
  let validEmail: EmailAddress;
  let validPasswordHash: PasswordHash;
  let validProfile: UserProfile;

  beforeEach(() => {
    validEmail = EmailAddress.create('test@example.com');
    validPasswordHash = PasswordHash.create('$2a$10$examplehashexamplehashexam');
    validProfile = UserProfile.create('John', 'Doe', 'en-US');
  });

  describe('create', () => {
    it('nên tạo một user hợp lệ với trạng thái PendingConfirmation', () => {
      // Arrange & Act
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });

      // Assert
      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(validEmail);
      expect(user.passwordHash).toBe(validPasswordHash);
      expect(user.profile).toBe(validProfile);
      expect(user.status.is(UserStatusValues.PENDING_CONFIRMATION)).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('changePassword', () => {
    it('nên cập nhật mật khẩu thành công', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      const newPasswordHash = PasswordHash.create('$2a$10$newpasswordhashexample');
      const originalUpdatedAt = user.updatedAt;

      // Act
      user.changePassword(newPasswordHash);

      // Assert
      expect(user.passwordHash).toBe(newPasswordHash);
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('nên ném lỗi khi password hash mới không hợp lệ', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });

      // Act & Assert
      expect(() => user.changePassword(null as unknown as PasswordHash)).toThrow();
      expect(() => user.changePassword(undefined as unknown as PasswordHash)).toThrow();
    });
  });

  describe('updateProfile', () => {
    it('nên cập nhật thông tin profile thành công', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      const newProfile = UserProfile.create('Jane', 'Smith', 'fr-FR');
      const originalUpdatedAt = user.updatedAt;

      // Act
      user.updateProfile(newProfile);

      // Assert
      expect(user.profile).toBe(newProfile);
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('activate', () => {
    it('nên kích hoạt user thành công', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      const originalUpdatedAt = user.updatedAt;

      // Act
      user.activate();

      // Assert
      expect(user.status.is(UserStatusValues.ACTIVE)).toBe(true);
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('nên không làm gì khi user đã ở trạng thái active', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      user.activate(); // Kích hoạt lần đầu
      const updatedAt = user.updatedAt;

      // Act - Thử kích hoạt lần nữa
      user.activate();

      // Assert - Không có thay đổi
      expect(user.status.is(UserStatusValues.ACTIVE)).toBe(true);
      expect(user.updatedAt).toEqual(updatedAt);
    });
  });

  describe('deactivate', () => {
    it('nên hủy kích hoạt user thành công', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      user.activate(); // Kích hoạt trước
      const originalUpdatedAt = user.updatedAt;

      // Act
      user.deactivate();

      // Assert
      expect(user.status.is(UserStatusValues.INACTIVE)).toBe(true);
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('initiatePasswordReset', () => {
    it('nên khởi tạo quá trình đặt lại mật khẩu thành công', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      const resetToken = 'reset-token-123';
      const expiresAt = new Date(Date.now() + 3600000); // 1 giờ từ bây giờ
      const originalUpdatedAt = user.updatedAt;

      // Act
      user.initiatePasswordReset(resetToken, expiresAt);

      // Assert
      expect(user.passwordResetToken).toBe(resetToken);
      expect(user.passwordResetTokenExpiresAt).toBe(expiresAt);
      expect(user.status.is(UserStatusValues.PASSWORD_RESET_REQUESTED)).toBe(true);
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('completePasswordReset', () => {
    it('nên hoàn thành quá trình đặt lại mật khẩu thành công', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      const resetToken = 'reset-token-123';
      const expiresAt = new Date(Date.now() + 3600000);
      user.initiatePasswordReset(resetToken, expiresAt);
      const originalUpdatedAt = user.updatedAt;

      // Act
      user.completePasswordReset();

      // Assert
      expect(user.passwordResetToken).toBeUndefined();
      expect(user.passwordResetTokenExpiresAt).toBeUndefined();
      expect(user.status.is(UserStatusValues.ACTIVE)).toBe(true);
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('initiateEmailVerification', () => {
    it('nên khởi tạo quá trình xác minh email thành công', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      const verificationToken = 'verification-token-123';
      const expiresAt = new Date(Date.now() + 3600000);
      const originalUpdatedAt = user.updatedAt;

      // Act
      user.initiateEmailVerification(verificationToken, expiresAt);

      // Assert
      expect(user.emailVerificationToken).toBe(verificationToken);
      expect(user.emailVerificationTokenExpiresAt).toBe(expiresAt);
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('nên không làm gì khi user đã ở trạng thái active', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      user.activate(); // Kích hoạt trước
      const originalUpdatedAt = user.updatedAt;

      // Act
      user.initiateEmailVerification('token', new Date());

      // Assert - Không có thay đổi cho emailVerificationToken
      expect(user.emailVerificationToken).toBeUndefined();
      expect(user.emailVerificationTokenExpiresAt).toBeUndefined();
    });
  });

  describe('completeEmailVerification', () => {
    it('nên hoàn thành quá trình xác minh email thành công', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      const verificationToken = 'verification-token-123';
      const expiresAt = new Date(Date.now() + 3600000);
      user.initiateEmailVerification(verificationToken, expiresAt);
      const originalUpdatedAt = user.updatedAt;

      // Act
      user.completeEmailVerification();

      // Assert
      expect(user.emailVerificationToken).toBeUndefined();
      expect(user.emailVerificationTokenExpiresAt).toBeUndefined();
      expect(user.status.is(UserStatusValues.ACTIVE)).toBe(true);
      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('nên không làm gì khi user đã ở trạng thái active', () => {
      // Arrange
      const user = User.create({
        email: validEmail,
        passwordHash: validPasswordHash,
        profile: validProfile,
      });
      user.activate(); // Kích hoạt trước
      const updatedAt = user.updatedAt;

      // Act
      user.completeEmailVerification();

      // Assert - Không có thay đổi
      expect(user.status.is(UserStatusValues.ACTIVE)).toBe(true);
      expect(user.updatedAt).toEqual(updatedAt);
    });
  });
});
