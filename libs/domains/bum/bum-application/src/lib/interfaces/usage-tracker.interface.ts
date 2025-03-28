/**
 * Interface cho phép theo dõi việc sử dụng tài nguyên của tổ chức
 */
export interface IUsageTrackerPort {
  /**
   * Ghi nhận việc sử dụng thêm tài nguyên của tổ chức
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên được sử dụng
   * @param amount Lượng tài nguyên sử dụng thêm
   * @param metadata Thông tin bổ sung về việc sử dụng
   */
  trackUsage(
    organizationId: string,
    resourceType: string,
    amount: number,
    metadata?: Record<string, unknown>
  ): Promise<void>;

  /**
   * Lấy tổng lượng sử dụng tài nguyên hiện tại của tổ chức
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên cần kiểm tra
   * @param periodStart Thời điểm bắt đầu chu kỳ
   * @param periodEnd Thời điểm kết thúc chu kỳ
   */
  getCurrentUsage(
    organizationId: string,
    resourceType: string,
    periodStart?: Date,
    periodEnd?: Date
  ): Promise<number>;

  /**
   * Lấy lịch sử sử dụng tài nguyên của tổ chức
   * @param organizationId ID của tổ chức
   * @param resourceType Loại tài nguyên cần kiểm tra
   * @param periodStart Thời điểm bắt đầu chu kỳ
   * @param periodEnd Thời điểm kết thúc chu kỳ
   */
  getUsageHistory(
    organizationId: string,
    resourceType: string,
    periodStart: Date,
    periodEnd: Date
  ): Promise<Array<{ timestamp: Date; amount: number; metadata?: Record<string, unknown> }>>;
}
