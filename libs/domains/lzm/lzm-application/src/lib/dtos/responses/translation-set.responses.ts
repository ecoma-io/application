/**
 * Response DTO cho thông tin TranslationSet
 */
export class TranslationSetDto {
  /**
   * ID duy nhất của tập bản dịch
   */
  id: string;

  /**
   * Tên định danh duy nhất của tập bản dịch
   */
  name: string;

  /**
   * Mô tả về tập bản dịch
   */
  description?: string;

  /**
   * Trạng thái hoạt động của tập bản dịch
   */
  isActive: boolean;

  /**
   * Thời điểm tạo
   */
  createdAt: Date;

  /**
   * Thời điểm cập nhật cuối cùng
   */
  updatedAt: Date;

  /**
   * Số lượng khóa bản dịch trong tập
   */
  keyCount?: number;

  /**
   * Danh sách khóa bản dịch (nếu includeKeys=true)
   */
  keys?: TranslationKeyBasicDto[];
}

/**
 * Response DTO cơ bản cho khóa bản dịch
 */
export class TranslationKeyBasicDto {
  /**
   * ID duy nhất của khóa bản dịch
   */
  id: string;

  /**
   * Chuỗi định danh duy nhất của khóa bản dịch
   */
  key: string;

  /**
   * Mô tả ngữ cảnh sử dụng của khóa bản dịch
   */
  description?: string;

  /**
   * Nội dung gốc của khóa bản dịch
   */
  sourceContent: string;

  /**
   * Trạng thái chung của khóa bản dịch
   */
  status: string;
}

/**
 * Response DTO cho danh sách TranslationSet phân trang
 */
export class TranslationSetListResponseDto {
  /**
   * Danh sách các tập bản dịch
   */
  items: TranslationSetDto[];

  /**
   * Tổng số tập bản dịch
   */
  total: number;

  /**
   * Số trang
   */
  page: number;

  /**
   * Số lượng tập bản dịch trên mỗi trang
   */
  limit: number;

  /**
   * Tổng số trang
   */
  totalPages: number;
}
