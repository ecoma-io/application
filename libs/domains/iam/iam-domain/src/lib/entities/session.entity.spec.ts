import { Session } from './session.entity';

describe('Session Entity', () => {
  const mockId = 'session-id';
  const mockUserId = 'user-id';
  const mockOrganizationId = 'org-id';
  const mockToken = 'session-token';
  const mockCreatedAt = new Date();
  const mockExpiresAt = new Date(mockCreatedAt.getTime() + 3600000); // 1 hour later

  it('nên tạo được một session tổ chức hợp lệ', () => {
    const session = new Session(
      mockId,
      mockUserId,
      mockOrganizationId,
      mockToken,
      mockExpiresAt,
      mockCreatedAt
    );

    expect(session.idValue).toBe(mockId);
    expect(session.getUserId).toBe(mockUserId);
    expect(session.getOrganizationId).toBe(mockOrganizationId);
    expect(session.getToken).toBe(mockToken);
    expect(session.getExpiresAt).toEqual(mockExpiresAt);
    expect(session.getCreatedAt).toEqual(mockCreatedAt);
  });

  it('nên tạo được một session nội bộ hợp lệ', () => {
    const session = new Session(
      mockId,
      mockUserId,
      null,
      mockToken,
      mockExpiresAt,
      mockCreatedAt
    );

    expect(session.idValue).toBe(mockId);
    expect(session.getUserId).toBe(mockUserId);
    expect(session.getOrganizationId).toBeNull();
    expect(session.getToken).toBe(mockToken);
    expect(session.getExpiresAt).toEqual(mockExpiresAt);
    expect(session.getCreatedAt).toEqual(mockCreatedAt);
  });

  it('nên kiểm tra được trạng thái hết hạn', () => {
    const futureDate = new Date(Date.now() + 3600000); // 1 hour in future
    const pastDate = new Date(Date.now() - 3600000); // 1 hour in past

    const activeSession = new Session(
      mockId,
      mockUserId,
      mockOrganizationId,
      mockToken,
      futureDate,
      mockCreatedAt
    );

    const expiredSession = new Session(
      'expired-session',
      mockUserId,
      mockOrganizationId,
      mockToken,
      pastDate,
      mockCreatedAt
    );

    expect(activeSession.isExpired()).toBe(false);
    expect(expiredSession.isExpired()).toBe(true);
  });

  it('nên kết thúc session bằng cách đặt thời gian hết hạn thành hiện tại', () => {
    const futureDate = new Date(Date.now() + 3600000); // 1 hour in future
    
    const session = new Session(
      mockId,
      mockUserId,
      mockOrganizationId,
      mockToken,
      futureDate,
      mockCreatedAt
    );

    expect(session.isExpired()).toBe(false);
    
    session.terminate();
    
    expect(session.isExpired()).toBe(true);
  });
}); 