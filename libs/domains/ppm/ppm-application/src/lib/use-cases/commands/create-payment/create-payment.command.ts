/**
 * Command để tạo một giao dịch thanh toán mới
 */
export class CreatePaymentCommand {
  /** ID của tổ chức */
  organizationId: string;

  /** Số tiền thanh toán */
  amount: number;

  /** Loại tiền tệ */
  currency: string;

  /** Loại phương thức thanh toán */
  paymentMethodType: string;

  /** Chi tiết phương thức thanh toán */
  paymentMethodDetails: Record<string, any>;

  /** Mô tả giao dịch (tùy chọn) */
  description?: string;

  /** Metadata giao dịch (tùy chọn) */
  metadata?: Record<string, any>;

  /** ID đơn hàng bên ngoài (tùy chọn) */
  externalOrderId?: string;

  /** ID khách hàng bên ngoài (tùy chọn) */
  externalCustomerId?: string;

  /** ID của cổng thanh toán */
  gatewayId?: string;

  constructor(data: {
    organizationId: string;
    amount: number;
    currency: string;
    paymentMethodType: string;
    paymentMethodDetails: Record<string, any>;
    description?: string;
    metadata?: Record<string, any>;
    externalOrderId?: string;
    externalCustomerId?: string;
    gatewayId?: string;
  }) {
    this.organizationId = data.organizationId;
    this.amount = data.amount;
    this.currency = data.currency;
    this.paymentMethodType = data.paymentMethodType;
    this.paymentMethodDetails = data.paymentMethodDetails;
    this.description = data.description;
    this.metadata = data.metadata;
    this.externalOrderId = data.externalOrderId;
    this.externalCustomerId = data.externalCustomerId;
    this.gatewayId = data.gatewayId;
  }
}
