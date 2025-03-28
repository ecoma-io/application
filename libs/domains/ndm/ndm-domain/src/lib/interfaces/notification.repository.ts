import { IRepository } from '@ecoma/common-domain';
import { Notification } from '../aggregates/notification.aggregate';
import { StringId } from '../value-objects';

/**
 * Repository interface để lưu trữ và truy xuất Notification
 */
export interface INotificationRepository extends IRepository<StringId, Notification> {
  /**
   * Tìm thông báo theo ID
   * @param id ID của thông báo
   * @returns Thông báo hoặc null nếu không tìm thấy
   */
  findById(id: StringId): Promise<Notification | null>;

  /**
   * Lưu thông báo
   * @param notification Đối tượng Notification cần lưu
   */
  save(notification: Notification): Promise<void>;

  /**
   * Tìm tất cả thông báo của một người nhận
   * @param recipientId ID của người nhận
   * @returns Danh sách thông báo
   */
  findByRecipientId(recipientId: string): Promise<Notification[]>;

  /**
   * Tìm tất cả thông báo của một tổ chức
   * @param organizationId ID của tổ chức
   * @returns Danh sách thông báo
   */
  findByOrganizationId(organizationId: string): Promise<Notification[]>;
}
