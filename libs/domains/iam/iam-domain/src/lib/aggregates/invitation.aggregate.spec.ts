import { Invitation } from './invitation.aggregate';
import { InvitationStatus } from '../value-objects/invitation-status.enum';

describe('Invitation Aggregate', () => {
  const mockId = 'invitation-id';
  const mockOrganizationId = 'org-id';
  const mockInviteeEmail = 'invitee@example.com';
  const mockInviterUserId = 'inviter-id';
  const mockRoleId = 'role-id';
  const mockToken = 'invitation-token';
  const mockCreatedAt = new Date();
  const mockExpiresAt = new Date(mockCreatedAt.getTime() + 86400000); // 24 hours later

  describe('Tạo lời mời', () => {
    it('nên tạo được lời mời hợp lệ', () => {
      const invitation = new Invitation(
        mockId,
        mockOrganizationId,
        mockInviteeEmail,
        mockInviterUserId,
        mockRoleId,
        mockToken,
        mockExpiresAt
      );

      expect(invitation.idValue).toBe(mockId);
      expect(invitation.getOrganizationId).toBe(mockOrganizationId);
      expect(invitation.getInviteeEmail).toBe(mockInviteeEmail);
      expect(invitation.getInviterUserId).toBe(mockInviterUserId);
      expect(invitation.getRoleId).toBe(mockRoleId);
      expect(invitation.getToken).toBe(mockToken);
      expect(invitation.getExpiresAt).toEqual(mockExpiresAt);
      expect(invitation.getStatus).toBe(InvitationStatus.PENDING);
    });

    it('nên ném lỗi khi tạo lời mời với ID tổ chức rỗng', () => {
      expect(() => {
        new Invitation(
          mockId,
          '',
          mockInviteeEmail,
          mockInviterUserId,
          mockRoleId,
          mockToken,
          mockExpiresAt
        );
      }).toThrow('ID tổ chức không được để trống');
    });

    it('nên ném lỗi khi tạo lời mời với email người được mời rỗng', () => {
      expect(() => {
        new Invitation(
          mockId,
          mockOrganizationId,
          '',
          mockInviterUserId,
          mockRoleId,
          mockToken,
          mockExpiresAt
        );
      }).toThrow('Email người được mời không được để trống');
    });
  });

  describe('Kiểm tra hết hạn', () => {
    it('nên xác định đúng lời mời chưa hết hạn', () => {
      const futureDate = new Date(Date.now() + 3600000); // 1 hour in future
      
      const invitation = new Invitation(
        mockId,
        mockOrganizationId,
        mockInviteeEmail,
        mockInviterUserId,
        mockRoleId,
        mockToken,
        futureDate
      );

      expect(invitation.isExpired()).toBe(false);
    });

    it('nên xác định đúng lời mời đã hết hạn', () => {
      const pastDate = new Date(Date.now() - 3600000); // 1 hour in past
      
      const invitation = new Invitation(
        mockId,
        mockOrganizationId,
        mockInviteeEmail,
        mockInviterUserId,
        mockRoleId,
        mockToken,
        pastDate
      );

      expect(invitation.isExpired()).toBe(true);
    });
  });

  describe('Quản lý vòng đời lời mời', () => {
    let invitation: Invitation;

    beforeEach(() => {
      const futureDate = new Date(Date.now() + 3600000); // 1 hour in future
      invitation = new Invitation(
        mockId,
        mockOrganizationId,
        mockInviteeEmail,
        mockInviterUserId,
        mockRoleId,
        mockToken,
        futureDate
      );
    });

    it('nên chấp nhận được lời mời', () => {
      invitation.accept();
      expect(invitation.getStatus).toBe(InvitationStatus.ACCEPTED);
    });

    it('nên từ chối được lời mời', () => {
      invitation.decline();
      expect(invitation.getStatus).toBe(InvitationStatus.DECLINED);
    });

    it('nên đánh dấu được lời mời hết hạn', () => {
      invitation.expire();
      expect(invitation.getStatus).toBe(InvitationStatus.EXPIRED);
    });

    it('nên thu hồi được lời mời', () => {
      invitation.revoke();
      expect(invitation.getStatus).toBe(InvitationStatus.REVOKED);
    });

    it('nên gửi lại được lời mời đã hết hạn', () => {
      invitation.expire();
      expect(invitation.getStatus).toBe(InvitationStatus.EXPIRED);

      const newToken = 'new-token';
      const newExpiresAt = new Date(Date.now() + 86400000);
      invitation.resend(newToken, newExpiresAt);

      expect(invitation.getToken).toBe(newToken);
      expect(invitation.getExpiresAt).toEqual(newExpiresAt);
      expect(invitation.getStatus).toBe(InvitationStatus.PENDING);
    });

    it('nên ném lỗi khi chấp nhận lời mời không ở trạng thái Pending', () => {
      invitation.decline();
      expect(() => {
        invitation.accept();
      }).toThrow('Chỉ có thể chấp nhận lời mời đang ở trạng thái Pending');
    });

    it('nên ném lỗi khi từ chối lời mời không ở trạng thái Pending', () => {
      invitation.accept();
      expect(() => {
        invitation.decline();
      }).toThrow('Chỉ có thể từ chối lời mời đang ở trạng thái Pending');
    });

    it('nên ném lỗi khi đánh dấu hết hạn lời mời không ở trạng thái Pending', () => {
      invitation.accept();
      expect(() => {
        invitation.expire();
      }).toThrow('Chỉ có thể đánh dấu hết hạn cho lời mời đang ở trạng thái Pending');
    });

    it('nên ném lỗi khi thu hồi lời mời không ở trạng thái Pending hoặc Expired', () => {
      invitation.accept();
      expect(() => {
        invitation.revoke();
      }).toThrow('Chỉ có thể thu hồi lời mời đang ở trạng thái Pending hoặc Expired');
    });

    it('nên ném lỗi khi gửi lại lời mời không ở trạng thái Pending hoặc Expired', () => {
      invitation.accept();
      expect(() => {
        invitation.resend('new-token', new Date());
      }).toThrow('Chỉ có thể gửi lại lời mời đang ở trạng thái Pending hoặc Expired');
    });
  });
}); 