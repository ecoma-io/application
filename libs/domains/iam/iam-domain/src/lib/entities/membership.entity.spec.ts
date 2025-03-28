import { Membership } from './membership.entity';

describe('Membership Entity', () => {
  const mockId = 'membership-id';
  const mockUserId = 'user-id';
  const mockOrganizationId = 'org-id';
  const mockRoleId = 'role-id';
  const mockJoinedAt = new Date();

  it('nên tạo được một membership tổ chức hợp lệ', () => {
    const membership = new Membership(
      mockId,
      mockUserId,
      mockOrganizationId,
      mockRoleId,
      mockJoinedAt
    );

    expect(membership.idValue).toBe(mockId);
    expect(membership.getUserId).toBe(mockUserId);
    expect(membership.getOrganizationId).toBe(mockOrganizationId);
    expect(membership.getRoleId).toBe(mockRoleId);
    expect(membership.getJoinedAt).toEqual(mockJoinedAt);
  });

  it('nên tạo được một membership nội bộ hợp lệ', () => {
    const membership = new Membership(
      mockId,
      mockUserId,
      null,
      mockRoleId,
      mockJoinedAt
    );

    expect(membership.idValue).toBe(mockId);
    expect(membership.getUserId).toBe(mockUserId);
    expect(membership.getOrganizationId).toBeNull();
    expect(membership.getRoleId).toBe(mockRoleId);
    expect(membership.getJoinedAt).toEqual(mockJoinedAt);
  });

  it('nên thay đổi được vai trò', () => {
    const membership = new Membership(
      mockId,
      mockUserId,
      mockOrganizationId,
      mockRoleId,
      mockJoinedAt
    );

    const newRoleId = 'new-role-id';
    membership.changeRole(newRoleId);

    expect(membership.getRoleId).toBe(newRoleId);
  });

  it('nên ném lỗi khi thay đổi vai trò với ID rỗng', () => {
    const membership = new Membership(
      mockId,
      mockUserId,
      mockOrganizationId,
      mockRoleId,
      mockJoinedAt
    );

    expect(() => membership.changeRole('')).toThrow('ID vai trò không được để trống');
  });
}); 