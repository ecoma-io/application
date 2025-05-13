import { UuidId } from '@ecoma/common-domain';
import { Session } from './session.entity';

describe('Session Entity', () => {
  let validProps: {
    userId: string;
    token: string;
    expiresAt: Date;
    organizationId?: string;
  };
  let validId: UuidId;

  beforeEach(() => {
    validProps = {
      userId: 'user-123',
      token: 'valid-session-token-123',
      expiresAt: new Date(Date.now() + 3600000), // 1 giờ từ bây giờ
      organizationId: 'org-123',
    };
    validId = UuidId.create();
  });

  describe('create', () => {
    it('nên tạo một session hợp lệ', () => {
      // Arrange & Act
      const session = Session.create(validProps, validId);

      // Assert
      expect(session).toBeDefined();
      expect(session.id).toBe(validId);
      expect(session.userId).toBe(validProps.userId);
      expect(session.token).toBe(validProps.token);
      expect(session.expiresAt).toBe(validProps.expiresAt);
      expect(session.organizationId).toBe(validProps.organizationId);
      expect(session.createdAt).toBeInstanceOf(Date);
      expect(session.lastActiveAt).toBeInstanceOf(Date);
    });

    it('nên tạo session không có organizationId (phiên nội bộ)', () => {
      // Arrange
      const internalSessionProps = {
        userId: 'internal-user-123',
        token: 'valid-session-token-456',
        expiresAt: new Date(Date.now() + 3600000),
      };

      // Act
      const session = Session.create(internalSessionProps, validId);

      // Assert
      expect(session).toBeDefined();
      expect(session.organizationId).toBeUndefined();
    });

    it('nên ném lỗi khi userId không được cung cấp', () => {
      // Arrange, Act & Assert
      expect(() => {
        Session.create(
          {
            ...validProps,
            userId: '',
          },
          validId
        );
      }).toThrow();

      expect(() => {
        Session.create(
          {
            ...validProps,
            userId: null as unknown as string,
          },
          validId
        );
      }).toThrow();

      expect(() => {
        Session.create(
          {
            ...validProps,
            userId: undefined as unknown as string,
          },
          validId
        );
      }).toThrow();
    });

    it('nên ném lỗi khi token không được cung cấp', () => {
      // Arrange, Act & Assert
      expect(() => {
        Session.create(
          {
            ...validProps,
            token: '',
          },
          validId
        );
      }).toThrow();

      expect(() => {
        Session.create(
          {
            ...validProps,
            token: null as unknown as string,
          },
          validId
        );
      }).toThrow();

      expect(() => {
        Session.create(
          {
            ...validProps,
            token: undefined as unknown as string,
          },
          validId
        );
      }).toThrow();
    });

    it('nên ném lỗi khi expiresAt không được cung cấp hoặc ở quá khứ', () => {
      // Arrange, Act & Assert
      expect(() => {
        Session.create(
          {
            ...validProps,
            expiresAt: null as unknown as Date,
          },
          validId
        );
      }).toThrow();

      expect(() => {
        Session.create(
          {
            ...validProps,
            expiresAt: undefined as unknown as Date,
          },
          validId
        );
      }).toThrow();

      expect(() => {
        Session.create(
          {
            ...validProps,
            expiresAt: new Date(Date.now() - 1000), // quá khứ
          },
          validId
        );
      }).toThrow();
    });
  });

  describe('isExpired', () => {
    it('nên trả về false khi session chưa hết hạn', () => {
      // Arrange
      const session = Session.create(validProps, validId);

      // Act & Assert
      expect(session.isExpired()).toBe(false);
    });

    it('nên trả về true khi session đã hết hạn', () => {
      // Arrange
      // Tạo một past date để test
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1); // 1 năm trước

      // Mock Date.now để test isExpired
      const originalNow = Date.now;
      Date.now = jest.fn(() =>
        pastDate.getTime() + 2 * 3600000 // 2 giờ sau expiresAt
      );

      // Tạo session đã hết hạn
      const expiredProps = {
        ...validProps,
        expiresAt: new Date(pastDate.getTime() + 3600000), // 1 giờ sau pastDate
      };

      const session = Session.create(expiredProps, validId);

      // Act & Assert
      expect(session.isExpired()).toBe(true);

      // Restore Date.now
      Date.now = originalNow;
    });
  });

  describe('updateLastActiveTime', () => {
    it('nên cập nhật lastActiveAt thành thời gian hiện tại', () => {
      // Arrange
      const session = Session.create(validProps, validId);
      const originalLastActiveAt = session.lastActiveAt;

      // Mock Date để có sự khác biệt thời gian
      jest.useFakeTimers();
      jest.setSystemTime(new Date(originalLastActiveAt.getTime() + 1000));

      // Act
      session.updateLastActiveTime();

      // Assert
      expect(session.lastActiveAt.getTime()).toBeGreaterThan(originalLastActiveAt.getTime());

      // Clean up
      jest.useRealTimers();
    });
  });

  describe('extendSession', () => {
    it('nên mở rộng thời gian hết hạn của session', () => {
      // Arrange
      const session = Session.create(validProps, validId);
      const originalExpiresAt = session.expiresAt;
      const newExpiresAt = new Date(originalExpiresAt.getTime() + 3600000); // thêm 1 giờ

      // Act
      session.extendSession(newExpiresAt);

      // Assert
      expect(session.expiresAt).toBe(newExpiresAt);
      expect(session.expiresAt.getTime()).toBeGreaterThan(originalExpiresAt.getTime());
    });

    it('nên ném lỗi khi newExpiresAt không hợp lệ', () => {
      // Arrange
      const session = Session.create(validProps, validId);
      const originalExpiresAt = session.expiresAt;

      // Act & Assert - newExpiresAt là null/undefined
      expect(() => {
        session.extendSession(null as unknown as Date);
      }).toThrow();

      expect(() => {
        session.extendSession(undefined as unknown as Date);
      }).toThrow();

      // Act & Assert - newExpiresAt là quá khứ
      expect(() => {
        session.extendSession(new Date(Date.now() - 1000));
      }).toThrow();

      // Act & Assert - newExpiresAt trước originalExpiresAt
      expect(() => {
        session.extendSession(new Date(originalExpiresAt.getTime() - 1000));
      }).toThrow();

      // Đảm bảo expiresAt không bị thay đổi
      expect(session.expiresAt).toBe(originalExpiresAt);
    });
  });
});
