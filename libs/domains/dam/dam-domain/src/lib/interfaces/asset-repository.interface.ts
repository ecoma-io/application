import { Asset } from '../aggregates/asset/asset.aggregate';

/**
 * Interface định nghĩa các phương thức repository cho Aggregate Root Asset.
 */
export interface IAssetRepository {
  /**
   * Tìm một tài sản theo ID.
   *
   * @param id - ID của tài sản cần tìm
   * @returns Promise với tài sản nếu tìm thấy, null nếu không tìm thấy
   */
  findById(id: string): Promise<Asset | null>;

  /**
   * Lưu một tài sản (tạo mới hoặc cập nhật).
   *
   * @param asset - Tài sản cần lưu
   * @returns Promise với tài sản đã được lưu
   */
  save(asset: Asset): Promise<Asset>;

  /**
   * Xóa một tài sản.
   *
   * @param asset - Tài sản cần xóa
   * @returns Promise với true nếu xóa thành công
   */
  delete(asset: Asset): Promise<boolean>;

  /**
   * Tìm tài sản theo thư mục.
   *
   * @param folderId - ID của thư mục
   * @param page - Số trang (từ 1)
   * @param limit - Số lượng kết quả mỗi trang
   * @returns Promise với danh sách tài sản và tổng số
   */
  findByFolder(folderId: string, page: number, limit: number): Promise<{ assets: Asset[]; total: number }>;

  /**
   * Tìm tài sản theo tổ chức.
   *
   * @param tenantId - ID của tổ chức (null cho tài sản nội bộ)
   * @param page - Số trang (từ 1)
   * @param limit - Số lượng kết quả mỗi trang
   * @returns Promise với danh sách tài sản và tổng số
   */
  findByTenant(tenantId: string | null, page: number, limit: number): Promise<{ assets: Asset[]; total: number }>;

  /**
   * Đếm số lượng tài sản của một tổ chức.
   *
   * @param tenantId - ID của tổ chức (null cho tài sản nội bộ)
   * @returns Promise với số lượng tài sản
   */
  countByTenant(tenantId: string | null): Promise<number>;

  /**
   * Tìm tài sản theo trạng thái.
   *
   * @param status - Trạng thái cần tìm
   * @param page - Số trang (từ 1)
   * @param limit - Số lượng kết quả mỗi trang
   * @returns Promise với danh sách tài sản và tổng số
   */
  findByStatus(status: string, page: number, limit: number): Promise<{ assets: Asset[]; total: number }>;

  /**
   * Tìm tài sản theo nhiều tiêu chí.
   *
   * @param criteria - Các tiêu chí tìm kiếm
   * @param page - Số trang (từ 1)
   * @param limit - Số lượng kết quả mỗi trang
   * @returns Promise với danh sách tài sản và tổng số
   */
  findByCriteria(criteria: any, page: number, limit: number): Promise<{ assets: Asset[]; total: number }>;
}
