import { Role } from './role.aggregate';
import { RoleScope } from '../value-objects/role-scope.enum';
import { PermissionScope } from '../value-objects/permission-scope.enum';
import { Permission } from '../value-objects/permission.value-object';

describe('Role Aggregate', () => {
  const mockId = 'role-id';
  const mockName = 'Test Role';
  const mockDescription = 'Test role description';
  const mockInternalPermission = new Permission('Resource:Action:Internal', PermissionScope.INTERNAL);
  const mockOrgPermission = new Permission('Resource:Action:Organization', PermissionScope.ORGANIZATION);

  describe('Tạo vai trò', () => {
    it('nên tạo được vai trò nội bộ hợp lệ', () => {
      const role = new Role(
        mockId,
        mockName,
        mockDescription,
        RoleScope.INTERNAL,
        null,
        [mockInternalPermission]
      );

      expect(role.idValue).toBe(mockId);
      expect(role.getName).toBe(mockName);
      expect(role.getDescription).toBe(mockDescription);
      expect(role.getScope).toBe(RoleScope.INTERNAL);
      expect(role.getOrganizationId).toBeNull();
      expect(role.getPermissions).toEqual([mockInternalPermission]);
      expect(role.getIsSystemRole).toBe(false);
    });

    it('nên tạo được vai trò tổ chức hợp lệ', () => {
      const orgId = 'org-id';
      const role = new Role(
        mockId,
        mockName,
        mockDescription,
        RoleScope.ORGANIZATION,
        orgId,
        [mockOrgPermission]
      );

      expect(role.idValue).toBe(mockId);
      expect(role.getName).toBe(mockName);
      expect(role.getDescription).toBe(mockDescription);
      expect(role.getScope).toBe(RoleScope.ORGANIZATION);
      expect(role.getOrganizationId).toBe(orgId);
      expect(role.getPermissions).toEqual([mockOrgPermission]);
      expect(role.getIsSystemRole).toBe(false);
    });

    it('nên ném lỗi khi tạo vai trò nội bộ với organizationId', () => {
      expect(() => {
        new Role(
          mockId,
          mockName,
          mockDescription,
          RoleScope.INTERNAL,
          'org-id',
          [mockInternalPermission]
        );
      }).toThrow('Vai trò phạm vi Internal không được có ID tổ chức');
    });

    it('nên ném lỗi khi tạo vai trò tổ chức không có organizationId', () => {
      expect(() => {
        new Role(
          mockId,
          mockName,
          mockDescription,
          RoleScope.ORGANIZATION,
          null,
          [mockOrgPermission]
        );
      }).toThrow('ID tổ chức không được để trống cho vai trò phạm vi Organization');
    });

    it('nên ném lỗi khi tạo vai trò nội bộ với quyền hạn tổ chức', () => {
      expect(() => {
        new Role(
          mockId,
          mockName,
          mockDescription,
          RoleScope.INTERNAL,
          null,
          [mockOrgPermission]
        );
      }).toThrow('Phạm vi quyền hạn không tương thích với phạm vi vai trò');
    });

    it('nên ném lỗi khi tạo vai trò tổ chức với quyền hạn nội bộ', () => {
      expect(() => {
        new Role(
          mockId,
          mockName,
          mockDescription,
          RoleScope.ORGANIZATION,
          'org-id',
          [mockInternalPermission]
        );
      }).toThrow('Phạm vi quyền hạn không tương thích với phạm vi vai trò');
    });
  });

  describe('Cập nhật thông tin vai trò', () => {
    it('nên cập nhật được thông tin vai trò', () => {
      const role = new Role(
        mockId,
        mockName,
        mockDescription,
        RoleScope.INTERNAL,
        null,
        [mockInternalPermission]
      );

      const newName = 'Updated Role';
      const newDescription = 'Updated description';
      role.updateDetails(newName, newDescription);

      expect(role.getName).toBe(newName);
      expect(role.getDescription).toBe(newDescription);
    });

    it('nên ném lỗi khi cập nhật vai trò hệ thống', () => {
      const role = new Role(
        mockId,
        mockName,
        mockDescription,
        RoleScope.INTERNAL,
        null,
        [mockInternalPermission],
        true // isSystemRole
      );

      expect(() => {
        role.updateDetails('New Name', 'New Description');
      }).toThrow('Không thể cập nhật vai trò hệ thống');
    });
  });

  describe('Quản lý quyền hạn', () => {
    it('nên thêm được quyền hạn vào vai trò', () => {
      const role = new Role(
        mockId,
        mockName,
        mockDescription,
        RoleScope.INTERNAL,
        null,
        []
      );

      role.addPermission(mockInternalPermission);
      expect(role.getPermissions).toContainEqual(mockInternalPermission);
    });

    it('nên ném lỗi khi thêm quyền hạn đã tồn tại', () => {
      const role = new Role(
        mockId,
        mockName,
        mockDescription,
        RoleScope.INTERNAL,
        null,
        [mockInternalPermission]
      );

      expect(() => {
        role.addPermission(mockInternalPermission);
      }).toThrow('Quyền hạn đã tồn tại trong vai trò');
    });

    it('nên ném lỗi khi thêm quyền hạn không phù hợp với phạm vi vai trò', () => {
      const role = new Role(
        mockId,
        mockName,
        mockDescription,
        RoleScope.INTERNAL,
        null,
        []
      );

      expect(() => {
        role.addPermission(mockOrgPermission);
      }).toThrow('Phạm vi quyền hạn không tương thích với phạm vi vai trò');
    });

    it('nên xóa được quyền hạn khỏi vai trò', () => {
      const role = new Role(
        mockId,
        mockName,
        mockDescription,
        RoleScope.INTERNAL,
        null,
        [mockInternalPermission]
      );

      role.removePermission(mockInternalPermission.value);
      expect(role.getPermissions).toEqual([]);
    });

    it('nên ném lỗi khi xóa quyền hạn khỏi vai trò hệ thống', () => {
      const role = new Role(
        mockId,
        mockName,
        mockDescription,
        RoleScope.INTERNAL,
        null,
        [mockInternalPermission],
        true // isSystemRole
      );

      expect(() => {
        role.removePermission(mockInternalPermission.value);
      }).toThrow('Không thể thay đổi quyền hạn của vai trò hệ thống');
    });

    it('nên kiểm tra được quyền hạn trong vai trò', () => {
      const role = new Role(
        mockId,
        mockName,
        mockDescription,
        RoleScope.INTERNAL,
        null,
        [mockInternalPermission]
      );

      expect(role.hasPermission(mockInternalPermission.value)).toBe(true);
      expect(role.hasPermission('NonExistentPermission')).toBe(false);
    });
  });
}); 