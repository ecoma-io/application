import { PaymentTransaction } from '../../aggregates/payment-transaction/payment-transaction.aggregate';

/**
 * Interface định nghĩa các thao tác repository của PaymentTransaction Aggregate
 */
export interface IPaymentTransactionRepository {
  /**
   * Lưu một PaymentTransaction mới hoặc cập nhật một PaymentTransaction hiện có
   * @param transaction - PaymentTransaction cần lưu hoặc cập nhật
   * @returns Promise<PaymentTransaction> - PaymentTransaction đã được lưu
   */
  save(transaction: PaymentTransaction): Promise<PaymentTransaction>;

  /**
   * Tìm một PaymentTransaction theo ID
   * @param id - ID của PaymentTransaction cần tìm
   * @returns Promise<PaymentTransaction | null> - PaymentTransaction nếu tìm thấy, null nếu không tìm thấy
   */
  findById(id: string): Promise<PaymentTransaction | null>;

  /**
   * Tìm tất cả các PaymentTransaction theo externalOrderId
   * @param externalOrderId - ID đơn hàng bên ngoài
   * @returns Promise<PaymentTransaction[]> - Danh sách PaymentTransaction liên quan đến đơn hàng
   */
  findByExternalOrderId(externalOrderId: string): Promise<PaymentTransaction[]>;

  /**
   * Tìm tất cả các PaymentTransaction theo organizationId
   * @param organizationId - ID của tổ chức
   * @param options - Tùy chọn phân trang và sắp xếp
   * @returns Promise<{ items: PaymentTransaction[]; totalCount: number }> - Danh sách PaymentTransaction và tổng số
   */
  findByOrganizationId(
    organizationId: string,
    options?: {
      skip?: number;
      take?: number;
      orderBy?: { field: string; direction: 'ASC' | 'DESC' };
    },
  ): Promise<{ items: PaymentTransaction[]; totalCount: number }>;

  /**
   * Tìm kiếm PaymentTransaction theo nhiều tiêu chí
   * @param criteria - Các tiêu chí tìm kiếm
   * @param options - Tùy chọn phân trang và sắp xếp
   * @returns Promise<{ items: PaymentTransaction[]; totalCount: number }> - Danh sách PaymentTransaction và tổng số
   */
  findByCriteria(
    criteria: {
      organizationId?: string;
      externalOrderId?: string;
      externalCustomerId?: string;
      status?: string[];
      fromDate?: Date;
      toDate?: Date;
      minAmount?: number;
      maxAmount?: number;
      currency?: string;
      paymentMethodType?: string;
      gatewayId?: string;
    },
    options?: {
      skip?: number;
      take?: number;
      orderBy?: { field: string; direction: 'ASC' | 'DESC' };
    },
  ): Promise<{ items: PaymentTransaction[]; totalCount: number }>;
}
