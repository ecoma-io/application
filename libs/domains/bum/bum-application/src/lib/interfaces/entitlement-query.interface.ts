/**
 * Interface cho phép truy vấn quyền lợi của tổ chức
 */
export interface IEntitlementQueryPort {
  /**
   * Kiểm tra xem tổ chức có quyền lợi sử dụng một tính năng cụ thể không
   * @param organizationId ID của tổ chức cần kiểm tra
   * @param featureType Loại tính năng cần kiểm tra
   */
  hasFeatureEntitlement(organizationId: string, featureType: string): Promise<boolean>;

  /**
   * Kiểm tra xem tổ chức có thể tiêu thụ thêm tài nguyên không
   * @param organizationId ID của tổ chức cần kiểm tra
   * @param resourceType Loại tài nguyên cần kiểm tra
   * @param currentUsage Lượng sử dụng hiện tại
   * @param additionalUsage Lượng sử dụng thêm cần kiểm tra
   */
  canConsumeResource(
    organizationId: string,
    resourceType: string,
    currentUsage: number,
    additionalUsage: number
  ): Promise<boolean>;

  /**
   * Lấy giới hạn tài nguyên hiện tại của tổ chức
   * @param organizationId ID của tổ chức cần kiểm tra
   * @param resourceType Loại tài nguyên cần kiểm tra
   */
  getResourceLimit(organizationId: string, resourceType: string): Promise<number | null>;
}
