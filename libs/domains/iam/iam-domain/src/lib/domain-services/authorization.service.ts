import { IUserRepository, IMembershipRepository, IRoleRepository, IPermissionDefinitionRepository } from '../interfaces';
import { PermissionScope } from '../value-objects';

/**
 * Kết quả kiểm tra quyền.
 */
export interface IAuthorizationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Thông tin về quyền lợi tính năng từ BUM.
 */
export interface ISubscriptionEntitlementDetails {
  featureType: string;
  resourceType: string;
  limit?: number;
  isActive: boolean;
}

/**
 * Domain Service kiểm tra quyền của người dùng dựa trên Vai trò, Quyền hạn và Entitlement.
 *
 * @since 1.0.0
 */
export class AuthorizationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly membershipRepository: IMembershipRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly permissionDefinitionRepository: IPermissionDefinitionRepository
  ) {}

  /**
   * Kiểm tra xem người dùng có quyền thực hiện một hành động cụ thể không.
   *
   * @param userId - ID của người dùng
   * @param requiredPermission - Quyền hạn cần kiểm tra
   * @param organizationId - ID của tổ chức (null nếu là phạm vi nội bộ)
   * @param entitlementProvider - Hàm để lấy thông tin entitlement từ BUM
   * @returns Promise<IAuthorizationResult> - Kết quả kiểm tra quyền
   */
  public async authorize(
    userId: string,
    requiredPermission: string,
    organizationId: string | null,
    entitlementProvider?: (organizationId: string, featureType: string) => Promise<ISubscriptionEntitlementDetails | null>
  ): Promise<IAuthorizationResult> {
    try {
      // Xác định phạm vi của quyền hạn yêu cầu
      const permissionScope = this.determinePermissionScope(requiredPermission);

      // Kiểm tra tính nhất quán giữa phạm vi quyền hạn và ngữ cảnh tổ chức
      if (permissionScope === PermissionScope.ORGANIZATION && !organizationId) {
        return { allowed: false, reason: 'Quyền hạn tổ chức yêu cầu ngữ cảnh tổ chức' };
      }

      if (permissionScope === PermissionScope.INTERNAL && organizationId) {
        return { allowed: false, reason: 'Quyền hạn nội bộ yêu cầu ngữ cảnh nội bộ' };
      }

      // Lấy membership phù hợp với ngữ cảnh
      let membership = null;
      if (organizationId) {
        membership = await this.membershipRepository.findByUserIdAndOrganizationId(userId, organizationId);
      } else {
        const internalMemberships = await this.membershipRepository.findInternalMemberships();
        membership = internalMemberships.find(m => m.getUserId === userId) || null;
      }

      if (!membership) {
        return { allowed: false, reason: 'Người dùng không có quyền truy cập trong ngữ cảnh này' };
      }

      // Lấy vai trò của người dùng
      const role = await this.roleRepository.findById(membership.getRoleId);
      if (!role) {
        return { allowed: false, reason: 'Không tìm thấy vai trò được gán cho người dùng' };
      }

      // Kiểm tra quyền hạn trực tiếp
      if (role.hasPermission(requiredPermission)) {
        // Nếu là phạm vi tổ chức, kiểm tra thêm entitlement
        if (permissionScope === PermissionScope.ORGANIZATION && organizationId && entitlementProvider) {
          // Trích xuất loại tính năng từ chuỗi quyền hạn (ví dụ: "Product:View:Organization" -> "Product")
          const featureType = requiredPermission.split(':')[0];

          // Lấy thông tin entitlement từ BUM
          const entitlement = await entitlementProvider(organizationId, featureType);

          // Kiểm tra xem tính năng có được kích hoạt trong gói dịch vụ không
          if (!entitlement || !entitlement.isActive) {
            return { allowed: false, reason: 'Tính năng không được kích hoạt trong gói dịch vụ' };
          }

          // Cho phép truy cập nếu tất cả điều kiện đều thỏa mãn
          return { allowed: true };
        }

        // Cho phép truy cập nếu có quyền hạn trực tiếp (phạm vi nội bộ hoặc không cần kiểm tra entitlement)
        return { allowed: true };
      }

      // Kiểm tra quyền hạn phân cấp
      const permissions = role.getPermissions.map(p => p.value);
      const hasPermissionHierarchically = await this.checkPermissionHierarchically(permissions, requiredPermission);
      if (hasPermissionHierarchically) {
        // Tương tự như trên, kiểm tra entitlement nếu cần
        if (permissionScope === PermissionScope.ORGANIZATION && organizationId && entitlementProvider) {
          const featureType = requiredPermission.split(':')[0];
          const entitlement = await entitlementProvider(organizationId, featureType);

          if (!entitlement || !entitlement.isActive) {
            return { allowed: false, reason: 'Tính năng không được kích hoạt trong gói dịch vụ' };
          }

          return { allowed: true };
        }

        return { allowed: true };
      }

      // Không có quyền hạn
      return { allowed: false, reason: 'Người dùng không có quyền hạn yêu cầu' };
    } catch (error) {
      return { allowed: false, reason: (error as Error).message };
    }
  }

  /**
   * Xác định phạm vi của quyền hạn từ chuỗi quyền hạn.
   *
   * @param permission - Chuỗi quyền hạn
   * @returns PermissionScope - Phạm vi của quyền hạn
   */
  private determinePermissionScope(permission: string): PermissionScope {
    const parts = permission.split(':');
    if (parts.length === 3) {
      const scopePart = parts[2];
      if (scopePart === 'Organization') {
        return PermissionScope.ORGANIZATION;
      } else if (scopePart === 'Internal') {
        return PermissionScope.INTERNAL;
      }
    }

    throw new Error('Định dạng quyền hạn không hợp lệ');
  }

  /**
   * Kiểm tra quyền hạn theo phân cấp.
   *
   * @param userPermissions - Danh sách các quyền hạn của người dùng
   * @param requiredPermission - Quyền hạn cần kiểm tra
   * @returns Promise<boolean> - true nếu người dùng có quyền hạn (trực tiếp hoặc thông qua phân cấp)
   */
  private async checkPermissionHierarchically(
    userPermissions: string[],
    requiredPermission: string
  ): Promise<boolean> {
    // Kiểm tra trực tiếp
    if (userPermissions.includes(requiredPermission)) {
      return true;
    }

    // Lấy định nghĩa quyền hạn cần kiểm tra
    const permissionDef = await this.permissionDefinitionRepository.findByValue(requiredPermission);
    if (!permissionDef) {
      return false;
    }

    // Nếu quyền hạn có quyền cha, kiểm tra xem người dùng có quyền cha không
    const parentId = permissionDef.getParentPermissionId;
    if (parentId) {
      const parentPermissionDef = await this.permissionDefinitionRepository.findById(parentId);
      if (parentPermissionDef && userPermissions.includes(parentPermissionDef.getValue)) {
        return true;
      }

      // Kiểm tra đệ quy lên các cấp cao hơn
      if (parentPermissionDef) {
        return this.checkPermissionHierarchically(userPermissions, parentPermissionDef.getValue);
      }
    }

    return false;
  }
}
