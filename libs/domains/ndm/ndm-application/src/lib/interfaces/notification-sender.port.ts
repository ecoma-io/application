import { Channel } from '@ecoma/ndm-domain';

/**
 * Interface định nghĩa các phương thức để gửi thông báo qua các kênh khác nhau
 */
export interface INotificationSenderPort {
  /**
   * Kiểm tra có hỗ trợ kênh gửi thông báo không
   * @param channel Kênh gửi thông báo
   */
  supportsChannel(channel: Channel): boolean;

  /**
   * Gửi thông báo
   * @param recipientId ID của người nhận
   * @param subject Tiêu đề thông báo
   * @param content Nội dung thông báo
   * @returns Promise void nếu gửi thành công
   * @throws Error nếu gửi thất bại
   */
  send(recipientId: string, subject: string, content: string): Promise<void>;
}
