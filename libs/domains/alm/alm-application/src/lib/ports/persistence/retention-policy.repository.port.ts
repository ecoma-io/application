import { Maybe } from '@ecoma/common-types';
import { RetentionPolicy } from '@ecoma/alm-domain'

/**
 * Port định nghĩa các thao tác repository cho RetentionPolicy
 */
export interface IRetentionPolicyRepositoryPort {
  /**
   * Tìm tất cả các chính sách retention hoặc lọc theo trạng thái hoạt động
   * @param isActive Tùy chọn trạng thái hoạt động để lọc
   */
  findAll(isActive?: Maybe<boolean>): Promise<Array<{ policy: RetentionPolicy; id: string }>>;

  /**
   * Tìm một chính sách retention theo ID
   * @param id ID của chính sách cần tìm
   */
  findById(id: string): Promise<Maybe<{ policy: RetentionPolicy; id: string }>>;

  /**
   * Lưu một chính sách retention mới hoặc cập nhật nếu đã tồn tại
   * @param policy RetentionPolicy cần lưu
   * @param id Tùy chọn ID của chính sách nếu cập nhật
   * @returns ID của chính sách đã lưu
   */
  save(policy: RetentionPolicy, id?: string): Promise<string>;

  /**
   * Xóa một chính sách retention theo ID
   * @param id ID của chính sách cần xóa
   */
  delete(id: string): Promise<void>;
}
