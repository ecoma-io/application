/**
 * DTO đại diện cho PaymentAttempt để trả về từ Application Layer
 */
export class PaymentAttemptDto {
  /** ID của lần thử */
  id: string;

  /** Thời điểm thử */
  attemptDate: Date;

  /** Trạng thái của lần thử */
  status: string;

  /** Dữ liệu phản hồi từ cổng thanh toán */
  gatewayResponse?: Record<string, any>;

  /** Lý do thất bại (nếu có) */
  failureReason?: string;

  /** Thời điểm tạo */
  createdAt: Date;

  constructor(data: Partial<PaymentAttemptDto>) {
    this.id = data.id!;
    this.attemptDate = data.attemptDate!;
    this.status = data.status!;
    this.gatewayResponse = data.gatewayResponse;
    this.failureReason = data.failureReason;
    this.createdAt = data.createdAt!;
  }
}
