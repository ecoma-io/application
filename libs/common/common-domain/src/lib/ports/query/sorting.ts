export interface ISort {
  /**
   * Tên trường của Domain Model (string) cần sắp xếp.
   * Lớp cài đặt Repository sẽ dịch tên trường này sang tên cột/path tương ứng trong database.
   * Ví dụ: "createdAt", "customer.name", "totalAmount"
   */
  field: string;

  /**
   * Hướng sắp xếp ('asc' - tăng dần, 'desc' - giảm dần).
   */
  direction: 'asc' | 'desc';
}