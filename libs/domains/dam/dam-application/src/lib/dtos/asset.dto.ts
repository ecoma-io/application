/**
 * DTO đại diện cho thông tin tổng quan của một tài sản.
 */
export class AssetDto {
  /**
   * ID duy nhất của tài sản.
   */
  id: string;

  /**
   * ID của tổ chức sở hữu tài sản. Null cho tài sản nội bộ.
   */
  tenantId: string | null;

  /**
   * Tên file gốc khi tải lên.
   */
  originalFileName: string;

  /**
   * Loại MIME của file gốc.
   */
  mimeType: string;

  /**
   * Kích thước file gốc (byte).
   */
  fileSize: number;

  /**
   * ID của người dùng đã tải lên.
   */
  uploadedByUserId: string;

  /**
   * Thời điểm tải lên.
   */
  uploadedAt: Date;

  /**
   * Trạng thái tài sản.
   */
  status: string;

  /**
   * Số phiên bản hiện tại.
   */
  currentVersion: number;

  /**
   * ID của thư mục chứa tài sản. Null nếu không thuộc thư mục nào.
   */
  folderId: string | null;

  /**
   * Thời điểm tạo tài sản.
   */
  createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng.
   */
  updatedAt: Date;

  /**
   * URL xem trước tài sản (thumbnail).
   */
  thumbnailUrl?: string;

  /**
   * Metadata chính của tài sản (title, description, v.v.).
   */
  metadata: Record<string, string>;

  /**
   * Chiều rộng của tài sản (pixel), tùy chọn.
   */
  width?: number;

  /**
   * Chiều cao của tài sản (pixel), tùy chọn.
   */
  height?: number;
}

/**
 * DTO đại diện cho thông tin chi tiết của một tài sản.
 */
export class AssetDetailDto extends AssetDto {
  /**
   * Danh sách các phiên bản (renditions) của tài sản.
   */
  renditions: AssetRenditionDto[];

  /**
   * Danh sách các phiên bản lịch sử của tài sản.
   */
  history: AssetHistoryDto[];

  /**
   * Tất cả metadata của tài sản, bao gồm cả metadata đa ngôn ngữ.
   */
  allMetadata: AssetMetadataDto[];
}

/**
 * DTO đại diện cho thông tin metadata của tài sản.
 */
export class AssetMetadataDto {
  /**
   * ID duy nhất của metadata.
   */
  id: string;

  /**
   * Khóa metadata.
   */
  key: string;

  /**
   * Giá trị metadata.
   */
  value: string;

  /**
   * Mã locale của metadata (null cho metadata chung).
   */
  locale: string | null;
}

/**
 * DTO đại diện cho thông tin rendition của tài sản.
 */
export class AssetRenditionDto {
  /**
   * ID duy nhất của rendition.
   */
  id: string;

  /**
   * Loại rendition.
   */
  renditionType: string;

  /**
   * URL để tải rendition.
   */
  url: string;

  /**
   * Loại MIME của rendition.
   */
  mimeType: string;

  /**
   * Kích thước file rendition (byte).
   */
  fileSize: number;

  /**
   * Chiều rộng của rendition (pixel), tùy chọn.
   */
  width?: number;

  /**
   * Chiều cao của rendition (pixel), tùy chọn.
   */
  height?: number;
}

/**
 * DTO đại diện cho thông tin lịch sử phiên bản của tài sản.
 */
export class AssetHistoryDto {
  /**
   * ID duy nhất của phiên bản lịch sử.
   */
  id: string;

  /**
   * Số phiên bản.
   */
  version: number;

  /**
   * ID của người dùng đã tạo phiên bản.
   */
  uploadedByUserId: string;

  /**
   * Thời điểm tạo phiên bản.
   */
  uploadedAt: Date;

  /**
   * URL để tải phiên bản lịch sử.
   */
  url?: string;
}
