/**
 * DTO đại diện cho thông tin của một thư mục.
 */
export class FolderDto {
  /**
   * ID duy nhất của thư mục.
   */
  id: string;

  /**
   * ID của tổ chức sở hữu thư mục. Null cho thư mục nội bộ.
   */
  tenantId: string | null;

  /**
   * Tên thư mục.
   */
  name: string;

  /**
   * Mô tả thư mục, tùy chọn.
   */
  description: string | null;

  /**
   * ID của thư mục cha. Null cho thư mục gốc.
   */
  parentFolderId: string | null;

  /**
   * Đường dẫn đầy đủ của thư mục.
   */
  path: string;

  /**
   * ID của người dùng đã tạo thư mục.
   */
  createdByUserId: string;

  /**
   * Thời điểm tạo thư mục.
   */
  createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng.
   */
  updatedAt: Date;

  /**
   * Thứ tự sắp xếp trong thư mục cha.
   */
  sortOrder: number;

  /**
   * Số lượng thư mục con (tùy chọn).
   */
  childFolderCount?: number;

  /**
   * Số lượng tài sản trong thư mục (tùy chọn).
   */
  assetCount?: number;
}

/**
 * DTO đại diện cho phân cấp thư mục.
 */
export class FolderHierarchyDto {
  /**
   * Thông tin thư mục.
   */
  folder: FolderDto;

  /**
   * Danh sách các thư mục con.
   */
  children: FolderHierarchyDto[];
}

/**
 * DTO đại diện cho nội dung của một thư mục.
 */
export class FolderContentDto {
  /**
   * Thông tin thư mục.
   */
  folder: FolderDto;

  /**
   * Danh sách các thư mục con.
   */
  childFolders: FolderDto[];

  /**
   * Danh sách các tài sản trong thư mục.
   */
  assets: {
    items: any[]; // AssetDto[] - Tránh import lặp nên để any
    total: number;
    page: number;
    limit: number;
  };
}
