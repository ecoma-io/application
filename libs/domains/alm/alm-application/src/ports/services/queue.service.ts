/**
 * Interface định nghĩa các phương thức tương tác với message queue
 */
export interface IQueueService {
  /**
   * Đẩy một batch audit log IDs lên queue để xóa
   * @param auditLogIds Danh sách các ID cần xóa
   * @param batchId ID của batch xử lý
   */
  queueAuditLogsForDeletion(auditLogIds: string[]): Promise<void>;
}
