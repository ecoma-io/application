/**
 * Kết quả xử lý thanh toán từ cổng thanh toán
 */
export interface PaymentProcessResult {
  success: boolean;
  gatewayTransactionId?: string;
  gatewayResponse: Record<string, any>;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Kết quả xử lý hoàn tiền từ cổng thanh toán
 */
export interface RefundProcessResult {
  success: boolean;
  gatewayRefundId?: string;
  gatewayResponse: Record<string, any>;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Thông tin thanh toán gửi đến cổng thanh toán
 */
export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethodDetails: Record<string, any>;
  description?: string;
  metadata?: Record<string, any>;
  customerId?: string;
  returnUrl?: string;
  idempotencyKey: string;
}

/**
 * Thông tin hoàn tiền gửi đến cổng thanh toán
 */
export interface RefundRequest {
  amount: number;
  currency: string;
  originalTransactionId: string;
  reason?: string;
  metadata?: Record<string, any>;
  idempotencyKey: string;
}

/**
 * Interface cho Payment Gateway Adapter
 * Mỗi cổng thanh toán cụ thể sẽ triển khai interface này
 */
export interface IPaymentGateway {
  /**
   * Lấy ID của cổng thanh toán
   * @returns ID của cổng thanh toán
   */
  getGatewayId(): string;

  /**
   * Lấy tên của cổng thanh toán
   * @returns Tên của cổng thanh toán
   */
  getGatewayName(): string;

  /**
   * Xử lý yêu cầu thanh toán
   * @param paymentRequest - Thông tin thanh toán cần xử lý
   * @returns Promise<PaymentProcessResult> - Kết quả xử lý thanh toán
   */
  processPayment(paymentRequest: PaymentRequest): Promise<PaymentProcessResult>;

  /**
   * Xử lý yêu cầu hoàn tiền
   * @param refundRequest - Thông tin hoàn tiền cần xử lý
   * @returns Promise<RefundProcessResult> - Kết quả xử lý hoàn tiền
   */
  processRefund(refundRequest: RefundRequest): Promise<RefundProcessResult>;

  /**
   * Kiểm tra xem cổng thanh toán có hỗ trợ loại phương thức thanh toán cụ thể không
   * @param paymentMethodType - Loại phương thức thanh toán cần kiểm tra
   * @returns boolean - true nếu hỗ trợ, false nếu không hỗ trợ
   */
  supportsPaymentMethodType(paymentMethodType: string): boolean;

  /**
   * Xác thực cấu hình cổng thanh toán
   * @param config - Cấu hình cổng thanh toán cần xác thực
   * @returns Promise<{ valid: boolean; error?: string }> - Kết quả xác thực
   */
  validateConfig(config: Record<string, any>): Promise<{ valid: boolean; error?: string }>;
}
