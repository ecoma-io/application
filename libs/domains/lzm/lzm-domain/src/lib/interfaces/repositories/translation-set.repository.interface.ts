import { TranslationSet } from '../../aggregates/translation-set.aggregate';

/**
 * Interface định nghĩa các phương thức repository cho TranslationSet Aggregate.
 */
export interface ITranslationSetRepository {
  /**
   * Lưu một TranslationSet mới hoặc cập nhật nếu đã tồn tại.
   * @param translationSet TranslationSet cần lưu
   * @returns Promise với TranslationSet đã lưu
   */
  save(translationSet: TranslationSet): Promise<TranslationSet>;

  /**
   * Tìm một TranslationSet theo ID.
   * @param id ID của TranslationSet cần tìm
   * @returns Promise với TranslationSet nếu tìm thấy, null nếu không
   */
  findById(id: string): Promise<TranslationSet | null>;

  /**
   * Tìm một TranslationSet theo tên.
   * @param name Tên của TranslationSet cần tìm
   * @returns Promise với TranslationSet nếu tìm thấy, null nếu không
   */
  findByName(name: string): Promise<TranslationSet | null>;

  /**
   * Lấy danh sách tất cả TranslationSet, có thể phân trang.
   * @param page Số trang (bắt đầu từ 0)
   * @param limit Số lượng item trên mỗi trang
   * @returns Promise với mảng các TranslationSet
   */
  findAll(page?: number, limit?: number): Promise<TranslationSet[]>;

  /**
   * Lấy tổng số TranslationSet.
   * @returns Promise với số lượng TranslationSet
   */
  count(): Promise<number>;

  /**
   * Xóa một TranslationSet theo ID.
   * @param id ID của TranslationSet cần xóa
   * @returns Promise với true nếu xóa thành công, false nếu không tìm thấy
   */
  delete(id: string): Promise<boolean>;

  /**
   * Kiểm tra xem tên TranslationSet đã tồn tại chưa.
   * @param name Tên cần kiểm tra
   * @param excludeId ID của TranslationSet cần loại trừ khỏi việc kiểm tra (cho trường hợp cập nhật)
   * @returns Promise với true nếu tên đã tồn tại, false nếu chưa
   */
  existsByName(name: string, excludeId?: string): Promise<boolean>;
}
