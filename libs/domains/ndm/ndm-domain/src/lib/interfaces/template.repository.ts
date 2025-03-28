import { IRepository } from '@ecoma/common-domain';
import { Template } from '../aggregates/template.aggregate';
import { Channel, StringId } from '../value-objects';

/**
 * Repository interface để lưu trữ và truy xuất Template
 */
export interface ITemplateRepository extends IRepository<StringId, Template> {
  /**
   * Tìm template theo ID
   * @param id ID của template
   * @returns Template hoặc null nếu không tìm thấy
   */
  findById(id: StringId): Promise<Template | null>;

  /**
   * Lưu template
   * @param template Đối tượng Template cần lưu
   */
  save(template: Template): Promise<void>;

  /**
   * Tìm tất cả template của một tổ chức
   * @param organizationId ID của tổ chức
   * @returns Danh sách template
   */
  findByOrganizationId(organizationId: string): Promise<Template[]>;

  /**
   * Tìm tất cả template của một tổ chức theo kênh gửi
   * @param organizationId ID của tổ chức
   * @param channel Kênh gửi (Email, SMS, Push, InApp)
   * @returns Danh sách template
   */
  findByOrganizationIdAndChannel(organizationId: string, channel: Channel): Promise<Template[]>;
}
  