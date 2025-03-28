/**
 * Chi tiết quyền lợi từ gói đăng ký.
 */
export interface ISubscriptionEntitlementDetails {
  /**
   * ID của quyền lợi.
   */
  id: string;

  /**
   * Loại quyền lợi (feature, resource, limit).
   */
  type: string;

  /**
   * Mã quyền lợi (feature.X, resource.Y, limit.Z).
   */
  code: string;

  /**
   * Giá trị số lượng (cho loại resource, limit).
   */
  numericValue?: number;

  /**
   * Giá trị boolean (cho loại feature).
   */
  booleanValue?: boolean;

  /**
   * Thời điểm hết hạn quyền lợi (nếu có).
   */
  expiresAt?: Date;

  /**
   * Trạng thái quyền lợi (active, suspended).
   */
  status: 'active' | 'suspended';
}

/**
 * Interface cho client giao tiếp với BUM Bounded Context.
 */
export interface IBumClient {
  /**
   * Lấy thông tin quyền lợi tính năng của tổ chức.
   * @param organizationId - ID của tổ chức
   * @returns Promise<ISubscriptionEntitlementDetails[]> - Danh sách quyền lợi tính năng
   */
  getOrganizationEntitlements(organizationId: string): Promise<ISubscriptionEntitlementDetails[]>;

  /**
   * Kiểm tra xem tổ chức có quyền lợi tính năng cụ thể không.
   * @param organizationId - ID của tổ chức
   * @param featureType - Loại tính năng cần kiểm tra
   * @returns Promise<boolean> - true nếu có quyền lợi và quyền lợi đang hoạt động
   */
  hasFeatureEntitlement(organizationId: string, featureType: string): Promise<boolean>;

  /**
   * Kiểm tra xem tổ chức có vượt quá hạn mức tài nguyên không.
   * @param organizationId - ID của tổ chức
   * @param resourceType - Loại tài nguyên
   * @param currentCount - Số lượng hiện tại
   * @returns Promise<boolean> - true nếu trong hạn mức, false nếu vượt quá
   */
  checkResourceLimit(organizationId: string, resourceType: string, currentCount: number): Promise<boolean>;

  /**
   * Lấy trạng thái kích hoạt của tổ chức từ BUM.
   * @param organizationId - ID của tổ chức
   * @returns Promise<boolean> - true nếu tổ chức đang hoạt động, false nếu bị tạm ngưng
   */
  isOrganizationActive(organizationId: string): Promise<boolean>;
} 