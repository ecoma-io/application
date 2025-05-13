import { UserStatus, UserStatusValues } from './user-status.vo';

describe('UserStatus', () => {
  describe('create', () => {
    it('nên tạo một UserStatus hợp lệ', () => {
      // Arrange & Act
      const status = UserStatus.create(UserStatusValues.ACTIVE);

      // Assert
      expect(status).toBeDefined();
      expect(status.value).toBe(UserStatusValues.ACTIVE);
    });
  });

  describe('createActive', () => {
    it('nên tạo một UserStatus với giá trị ACTIVE', () => {
      // Arrange & Act
      const status = UserStatus.createActive();

      // Assert
      expect(status.value).toBe(UserStatusValues.ACTIVE);
    });
  });

  describe('createInactive', () => {
    it('nên tạo một UserStatus với giá trị INACTIVE', () => {
      // Arrange & Act
      const status = UserStatus.createInactive();

      // Assert
      expect(status.value).toBe(UserStatusValues.INACTIVE);
    });
  });

  describe('createPendingConfirmation', () => {
    it('nên tạo một UserStatus với giá trị PENDING_CONFIRMATION', () => {
      // Arrange & Act
      const status = UserStatus.createPendingConfirmation();

      // Assert
      expect(status.value).toBe(UserStatusValues.PENDING_CONFIRMATION);
    });
  });

  describe('createPasswordResetRequested', () => {
    it('nên tạo một UserStatus với giá trị PASSWORD_RESET_REQUESTED', () => {
      // Arrange & Act
      const status = UserStatus.createPasswordResetRequested();

      // Assert
      expect(status.value).toBe(UserStatusValues.PASSWORD_RESET_REQUESTED);
    });
  });

  describe('is', () => {
    it('nên trả về true khi kiểm tra với trạng thái đúng', () => {
      // Arrange
      const status = UserStatus.createActive();

      // Act & Assert
      expect(status.is(UserStatusValues.ACTIVE)).toBe(true);
    });

    it('nên trả về false khi kiểm tra với trạng thái khác', () => {
      // Arrange
      const status = UserStatus.createActive();

      // Act & Assert
      expect(status.is(UserStatusValues.INACTIVE)).toBe(false);
      expect(status.is(UserStatusValues.PENDING_CONFIRMATION)).toBe(false);
      expect(status.is(UserStatusValues.PASSWORD_RESET_REQUESTED)).toBe(false);
    });
  });
});
