import { v4 as uuidv4 } from "uuid";

/**
 * Factory tạo dữ liệu test ngẫu nhiên cho unit/integration test.
 * @since 1.0.0
 */
export class TestDataFactory {
  /**
   * Tạo UUID ngẫu nhiên
   */
  static createUUID(): string {
    return uuidv4();
  }

  /**
   * Tạo email ngẫu nhiên
   */
  static createEmail(): string {
    return `user${Math.floor(Math.random() * 10000)}@example.com`;
  }

  /**
   * Tạo username ngẫu nhiên
   */
  static createUsername(): string {
    return `user_${Math.random().toString(36).substring(2, 10)}`;
  }

  /**
   * Tạo password ngẫu nhiên
   */
  static createPassword(): string {
    return Math.random().toString(36).slice(-10) + "A1!";
  }

  /**
   * Tạo số ngẫu nhiên trong khoảng [min, max]
   */
  static createNumber(min = 0, max = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Tạo ngày ngẫu nhiên trong khoảng [start, end]
   */
  static createDate(start: Date, end: Date): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  /**
   * Tạo chuỗi ngẫu nhiên với độ dài cho trước
   */
  static createString(length = 10): string {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length);
  }

  /**
   * Tạo tên sản phẩm ngẫu nhiên
   */
  static createProductName(): string {
    const products = [
      "Áo thun",
      "Quần jeans",
      "Giày sneaker",
      "Balo",
      "Mũ lưỡi trai",
      "Đồng hồ",
      "Túi xách",
    ];
    return (
      products[this.createNumber(0, products.length - 1)] +
      " " +
      this.createString(5)
    );
  }

  /**
   * Tạo mã SKU ngẫu nhiên
   */
  static createSKU(): string {
    return "SKU-" + this.createString(8).toUpperCase();
  }

  /**
   * Tạo số tiền ngẫu nhiên (VNĐ)
   */
  static createAmount(min = 10000, max = 1000000): number {
    return this.createNumber(min, max);
  }

  /**
   * Tạo trạng thái đơn hàng ngẫu nhiên
   */
  static createOrderStatus(): string {
    const statuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    return statuses[this.createNumber(0, statuses.length - 1)];
  }

  /**
   * Tạo tên khách hàng ngẫu nhiên
   */
  static createCustomerName(): string {
    const names = [
      "Nguyễn Văn A",
      "Trần Thị B",
      "Lê Văn C",
      "Phạm Thị D",
      "Hoàng Văn E",
    ];
    return names[this.createNumber(0, names.length - 1)];
  }
}
