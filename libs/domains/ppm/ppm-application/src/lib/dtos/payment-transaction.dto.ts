import { PaymentAttemptDto } from './payment-attempt.dto';
import { RefundDto } from './refund.dto';

/**
 * DTO đại diện cho PaymentTransaction để trả về từ Application Layer
 */
export class PaymentTransactionDto {
  /** ID của giao dịch */
  id: string;

  /** ID của tổ chức */
  organizationId: string;

  /** Loại giao dịch (PAYMENT, REFUND) */
  transactionType: string;

  /** Trạng thái giao dịch */
  status: string;

  /** Số tiền giao dịch */
  amount: number;

  /** Loại tiền tệ */
  currency: string;

  /** Loại phương thức thanh toán */
  paymentMethodType: string;

  /** Chi tiết phương thức thanh toán */
  paymentMethodDetails: Record<string, any>;

  /** Mô tả giao dịch */
  description?: string;

  /** Metadata giao dịch */
  metadata?: Record<string, any>;

  /** ID đơn hàng bên ngoài */
  externalOrderId?: string;

  /** ID khách hàng bên ngoài */
  externalCustomerId?: string;

  /** ID của cổng thanh toán */
  gatewayId: string;

  /** Thời điểm tạo */
  createdAt: Date;

  /** Thời điểm cập nhật */
  updatedAt: Date;

  /** Danh sách các lần thử thanh toán */
  attempts: PaymentAttemptDto[];

  /** Danh sách các khoản hoàn tiền */
  refunds: RefundDto[];

  constructor(data: Partial<PaymentTransactionDto>) {
    this.id = data.id!;
    this.organizationId = data.organizationId!;
    this.transactionType = data.transactionType!;
    this.status = data.status!;
    this.amount = data.amount!;
    this.currency = data.currency!;
    this.paymentMethodType = data.paymentMethodType!;
    this.paymentMethodDetails = data.paymentMethodDetails!;
    this.description = data.description;
    this.metadata = data.metadata;
    this.externalOrderId = data.externalOrderId;
    this.externalCustomerId = data.externalCustomerId;
    this.gatewayId = data.gatewayId!;
    this.createdAt = data.createdAt!;
    this.updatedAt = data.updatedAt!;
    this.attempts = data.attempts || [];
    this.refunds = data.refunds || [];
  }
}
