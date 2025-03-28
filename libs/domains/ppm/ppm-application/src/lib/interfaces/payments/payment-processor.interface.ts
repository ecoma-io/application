import { PaymentMethodType } from '@ecoma/ppm-domain';

/**
 * Interface cho Payment Processor service thực hiện xử lý thanh toán ở lớp application
 */
export interface IPaymentProcessor {
  /**
   * Xử lý thanh toán cho một giao dịch
   * @param transactionId - ID của giao dịch thanh toán
   * @returns Promise<{ success: boolean; attemptId: string; errorMessage?: string }> - Kết quả xử lý
   */
  processPayment(transactionId: string): Promise<{
    success: boolean;
    attemptId: string;
    errorMessage?: string;
  }>;

  /**
   * Xử lý hoàn tiền cho một giao dịch
   * @param transactionId - ID của giao dịch thanh toán
   * @param refundId - ID của yêu cầu hoàn tiền
   * @returns Promise<{ success: boolean; errorMessage?: string }> - Kết quả xử lý
   */
  processRefund(
    transactionId: string,
    refundId: string,
  ): Promise<{
    success: boolean;
    errorMessage?: string;
  }>;

  /**
   * Lấy danh sách các cổng thanh toán hỗ trợ phương thức thanh toán cụ thể
   * @param paymentMethodType - Loại phương thức thanh toán
   * @param organizationId - ID của tổ chức
   * @returns Promise<string[]> - Danh sách ID của các cổng thanh toán hỗ trợ
   */
  getSupportedGateways(
    paymentMethodType: PaymentMethodType,
    organizationId: string,
  ): Promise<string[]>;
}
