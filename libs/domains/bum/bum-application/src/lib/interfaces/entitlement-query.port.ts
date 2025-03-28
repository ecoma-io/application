/**
 * Port cho các truy vấn liên quan đến quyền lợi (entitlement)
 */
export interface IEntitlementQueryPort {
  /**
   * Kiểm tra quyền sử dụng một tính năng
   * @param organizationId ID của tổ chức
   * @param featureType Loại tính năng cần kiểm tra
   */
  checkFeatureEntitlement(organizationId: string, featureType: string): Promise<boolean>;

  /**
   * Kiểm tra quyền sử dụng một tài nguyên
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên cần kiểm tra
   * @param requestedAmount Số lượng tài nguyên yêu cầu
   */
  checkResourceEntitlement(
    organizationId: string,
    resourceType: string,
    requestedAmount: number
  ): Promise<boolean>;

  /**
   * Lấy giới hạn sử dụng của một loại tài nguyên
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên cần kiểm tra
   */
  getResourceLimit(organizationId: string, resourceType: string): Promise<number | null>;
}
