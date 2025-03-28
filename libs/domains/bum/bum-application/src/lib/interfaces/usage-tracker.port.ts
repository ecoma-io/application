/**
 * Port cho việc theo dõi và ghi nhận mức sử dụng tài nguyên
 */
export interface IUsageTrackerPort {
  /**
   * Ghi nhận mức sử dụng tài nguyên
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên
   * @param amount Số lượng sử dụng (dương là thêm, âm là giảm)
   * @param metadata Metadata bổ sung (tùy chọn)
   */
  recordUsage(
    organizationId: string,
    resourceType: string,
    amount: number,
    metadata?: Record<string, unknown>
  ): Promise<void>;

  /**
   * Lấy mức sử dụng hiện tại của một tài nguyên trong chu kỳ thanh toán hiện tại
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên
   */
  getCurrentUsage(
    organizationId: string,
    resourceType: string
  ): Promise<number>;

  /**
   * Lấy tổng mức sử dụng tài nguyên của tổ chức trong một khoảng thời gian
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên
   * @param startDate Ngày bắt đầu
   * @param endDate Ngày kết thúc
   */
  getUsageInPeriod(
    organizationId: string,
    resourceType: string,
    startDate: Date,
    endDate: Date
  ): Promise<number>;
}
