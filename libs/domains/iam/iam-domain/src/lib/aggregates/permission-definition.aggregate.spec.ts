import { PermissionDefinition } from './permission-definition.aggregate';
import { PermissionScope } from '../value-objects/permission-scope.enum';

describe('PermissionDefinition Aggregate', () => {
  const mockId = 'permission-def-id';
  const mockValue = 'Product:View:Organization';
  const mockDescription = 'Permission to view products';
  const mockScope = PermissionScope.ORGANIZATION;
  const mockName = 'view:products';
  const mockDisplayName = 'Xem sản phẩm';
  const mockGroupName = 'Sản phẩm';

  describe('Tạo định nghĩa quyền hạn', () => {
    it('nên tạo được định nghĩa quyền hạn gốc hợp lệ', () => {
      const permissionDef = new PermissionDefinition(
        mockId,
        mockValue,
        mockDescription,
        mockScope,
        null,
        new Date(),
        mockName,
        mockDisplayName,
        mockGroupName
      );

      expect(permissionDef.idValue).toBe(mockId);
      expect(permissionDef.getValue).toBe(mockValue);
      expect(permissionDef.getDescription).toBe(mockDescription);
      expect(permissionDef.getScope).toBe(mockScope);
      expect(permissionDef.getParentPermissionId).toBeNull();
      expect(permissionDef.getParentPermissionId === null).toBe(true);
    });

    it('nên tạo được định nghĩa quyền hạn con hợp lệ', () => {
      const parentId = 'parent-permission-id';
      const permissionDef = new PermissionDefinition(
        mockId,
        mockValue,
        mockDescription,
        mockScope,
        parentId,
        new Date(),
        mockName,
        mockDisplayName,
        mockGroupName
      );

      expect(permissionDef.idValue).toBe(mockId);
      expect(permissionDef.getValue).toBe(mockValue);
      expect(permissionDef.getDescription).toBe(mockDescription);
      expect(permissionDef.getScope).toBe(mockScope);
      expect(permissionDef.getParentPermissionId).toBe(parentId);
      expect(permissionDef.getParentPermissionId === null).toBe(false);
    });

    it('nên ném lỗi khi tạo định nghĩa quyền hạn với giá trị rỗng', () => {
      expect(() => {
        new PermissionDefinition(
          mockId,
          '',
          mockDescription,
          mockScope,
          null,
          new Date(),
          mockName,
          mockDisplayName,
          mockGroupName
        );
      }).toThrow('Giá trị quyền hạn không được để trống');
    });
  });

  describe('Định nghĩa quyền hạn cha', () => {
    it('nên cập nhật được quyền hạn cha', () => {
      const permissionDef = new PermissionDefinition(
        mockId,
        mockValue,
        mockDescription,
        mockScope,
        null,
        new Date(),
        mockName,
        mockDisplayName,
        mockGroupName
      );

      const parentId = 'parent-permission-id';
      permissionDef.update(mockDisplayName, mockDescription, mockGroupName, true, true);
      
      expect(permissionDef.getParentPermissionId).toBeNull();
    });

    it('nên đặt lại thành quyền hạn gốc', () => {
      const parentId = 'parent-permission-id';
      const permissionDef = new PermissionDefinition(
        mockId,
        mockValue,
        mockDescription,
        mockScope,
        parentId,
        new Date(),
        mockName,
        mockDisplayName,
        mockGroupName
      );

      expect(permissionDef.getParentPermissionId === null).toBe(false);

      permissionDef.update(mockDisplayName, mockDescription, mockGroupName, true, true);
      
      expect(permissionDef.getParentPermissionId).toBe(parentId);
    });
  });
}); 