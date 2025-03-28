/**
 * DTO đại diện cho Refund để trả về từ Application Layer
 */
export class RefundDto {
  /** ID của khoản hoàn tiền */
  id: string;

  /** Số tiền hoàn lại */
  amount: number;

  /** Loại tiền tệ */
  currency: string;

  /** Trạng thái của khoản hoàn tiền */
  status: string;

  /** Lý do hoàn tiền */
  reason: string;

  /** Mô tả chi tiết */
  description?: string;

  /** ID hoàn tiền từ cổng thanh toán */
  gatewayRefundId?: string;

  /** Lý do thất bại (nếu có) */
  failureReason?: string;

  /** Thời điểm tạo */
  createdAt: Date;

  /** Thời điểm cập nhật */
  updatedAt: Date;

  constructor(data: Partial<RefundDto>) {
    this.id = data.id!;
    this.amount = data.amount!;
    this.currency = data.currency!;
    this.status = data.status!;
    this.reason = data.reason!;
    this.description = data.description;
    this.gatewayRefundId = data.gatewayRefundId;
    this.failureReason = data.failureReason;
    this.createdAt = data.createdAt!;
    this.updatedAt = data.updatedAt!;
  }
}
