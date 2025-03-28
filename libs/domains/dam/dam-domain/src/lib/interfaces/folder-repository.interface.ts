import { Folder } from '../aggregates/folder/folder.aggregate';

/**
 * Interface định nghĩa các phương thức repository cho Aggregate Root Folder.
 */
export interface IFolderRepository {
  /**
   * Tìm một thư mục theo ID.
   *
   * @param id - ID của thư mục cần tìm
   * @returns Promise với thư mục nếu tìm thấy, null nếu không tìm thấy
   */
  findById(id: string): Promise<Folder | null>;

  /**
   * Lưu một thư mục (tạo mới hoặc cập nhật).
   *
   * @param folder - Thư mục cần lưu
   * @returns Promise với thư mục đã được lưu
   */
  save(folder: Folder): Promise<Folder>;

  /**
   * Xóa một thư mục.
   *
   * @param folder - Thư mục cần xóa
   * @returns Promise với true nếu xóa thành công
   */
  delete(folder: Folder): Promise<boolean>;

  /**
   * Tìm thư mục theo thư mục cha.
   *
   * @param parentFolderId - ID của thư mục cha (null cho thư mục gốc)
   * @param tenantId - ID của tổ chức (null cho thư mục nội bộ)
   * @returns Promise với danh sách thư mục con
   */
  findByParent(parentFolderId: string | null, tenantId: string | null): Promise<Folder[]>;

  /**
   * Tìm thư mục theo tổ chức.
   *
   * @param tenantId - ID của tổ chức (null cho thư mục nội bộ)
   * @returns Promise với danh sách thư mục
   */
  findByTenant(tenantId: string | null): Promise<Folder[]>;

  /**
   * Tìm thư mục theo path.
   *
   * @param path - Đường dẫn đầy đủ của thư mục
   * @param tenantId - ID của tổ chức (null cho thư mục nội bộ)
   * @returns Promise với thư mục nếu tìm thấy, null nếu không tìm thấy
   */
  findByPath(path: string, tenantId: string | null): Promise<Folder | null>;

  /**
   * Kiểm tra xem tên thư mục đã tồn tại trong thư mục cha chưa.
   *
   * @param name - Tên thư mục cần kiểm tra
   * @param parentFolderId - ID của thư mục cha (null cho thư mục gốc)
   * @param tenantId - ID của tổ chức (null cho thư mục nội bộ)
   * @param excludeFolderId - ID của thư mục cần loại trừ khi kiểm tra (khi cập nhật)
   * @returns Promise với true nếu tên đã tồn tại
   */
  existsByNameInParent(
    name: string,
    parentFolderId: string | null,
    tenantId: string | null,
    excludeFolderId?: string
  ): Promise<boolean>;

  /**
   * Tìm tất cả thư mục con (đệ quy) của một thư mục.
   *
   * @param folderId - ID của thư mục gốc
   * @returns Promise với danh sách tất cả thư mục con
   */
  findAllDescendants(folderId: string): Promise<Folder[]>;
}
