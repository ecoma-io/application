import { AttemptStatus } from '../../value-objects/attempt-status';

/**
 * PaymentAttempt Entity đại diện cho một lần thử thực hiện giao dịch thanh toán
 * với cổng thanh toán. PaymentAttempt thuộc về PaymentTransaction Aggregate.
 */
export class PaymentAttempt {
  private constructor(
    private readonly _id: string,
    private readonly _attemptDate: Date,
    private _status: AttemptStatus,
    private _gatewayResponse: Record<string, any> | null,
    private _failureReason: string | null,
    private readonly _createdAt: Date,
  ) {}

  /**
   * Tạo một đối tượng PaymentAttempt mới
   * @param id - ID duy nhất của lần thử
   * @param attemptDate - Thời điểm thử
   * @param status - Trạng thái lần thử ban đầu
   * @param gatewayResponse - Dữ liệu phản hồi từ cổng thanh toán (tuỳ chọn)
   * @param failureReason - Lý do thất bại (tuỳ chọn)
   * @param createdAt - Thời điểm tạo (mặc định là thời điểm hiện tại)
   * @returns Đối tượng PaymentAttempt mới
   */
  public static create(
    id: string,
    attemptDate: Date,
    status: AttemptStatus,
    gatewayResponse: Record<string, any> | null = null,
    failureReason: string | null = null,
    createdAt: Date = new Date(),
  ): PaymentAttempt {
    if (!id) {
      throw new Error('ID lần thử không được để trống');
    }

    return new PaymentAttempt(
      id,
      attemptDate,
      status,
      gatewayResponse,
      failureReason,
      createdAt,
    );
  }

  /**
   * Khôi phục đối tượng PaymentAttempt từ dữ liệu lưu trữ
   * @param data - Dữ liệu lưu trữ của PaymentAttempt
   * @returns Đối tượng PaymentAttempt
   */
  public static fromPersistence(data: {
    id: string;
    attemptDate: Date;
    status: string;
    gatewayResponse?: Record<string, any> | null;
    failureReason?: string | null;
    createdAt: Date;
  }): PaymentAttempt {
    return new PaymentAttempt(
      data.id,
      data.attemptDate,
      AttemptStatus.fromString(data.status),
      data.gatewayResponse || null,
      data.failureReason || null,
      data.createdAt,
    );
  }

  /**
   * Lấy ID của PaymentAttempt
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Lấy thời điểm thử của PaymentAttempt
   */
  public get attemptDate(): Date {
    return this._attemptDate;
  }

  /**
   * Lấy trạng thái của PaymentAttempt
   */
  public get status(): AttemptStatus {
    return this._status;
  }

  /**
   * Lấy dữ liệu phản hồi từ cổng thanh toán
   */
  public get gatewayResponse(): Record<string, any> | null {
    return this._gatewayResponse;
  }

  /**
   * Lấy lý do thất bại (nếu có)
   */
  public get failureReason(): string | null {
    return this._failureReason;
  }

  /**
   * Lấy thời điểm tạo của PaymentAttempt
   */
  public get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Cập nhật trạng thái thành công cho PaymentAttempt
   * @param gatewayResponse - Dữ liệu phản hồi từ cổng thanh toán
   */
  public markAsSuccess(gatewayResponse: Record<string, any>): void {
    this._status = AttemptStatus.success();
    this._gatewayResponse = gatewayResponse;
    this._failureReason = null;
  }

  /**
   * Cập nhật trạng thái thất bại cho PaymentAttempt
   * @param failureReason - Lý do thất bại
   * @param gatewayResponse - Dữ liệu phản hồi từ cổng thanh toán (tuỳ chọn)
   */
  public markAsFailure(
    failureReason: string,
    gatewayResponse: Record<string, any> | null = null,
  ): void {
    this._status = AttemptStatus.failure();
    this._failureReason = failureReason;

    if (gatewayResponse) {
      this._gatewayResponse = gatewayResponse;
    }
  }

  /**
   * Cập nhật trạng thái lỗi cho PaymentAttempt
   * @param failureReason - Lý do lỗi
   * @param gatewayResponse - Dữ liệu phản hồi từ cổng thanh toán (tuỳ chọn)
   */
  public markAsError(
    failureReason: string,
    gatewayResponse: Record<string, any> | null = null,
  ): void {
    this._status = AttemptStatus.error();
    this._failureReason = failureReason;

    if (gatewayResponse) {
      this._gatewayResponse = gatewayResponse;
    }
  }

  /**
   * Chuyển đổi sang dạng plain object để serialization
   */
  public toObject(): {
    id: string;
    attemptDate: Date;
    status: string;
    gatewayResponse: Record<string, any> | null;
    failureReason: string | null;
    createdAt: Date;
  } {
    return {
      id: this._id,
      attemptDate: this._attemptDate,
      status: this._status.toString(),
      gatewayResponse: this._gatewayResponse,
      failureReason: this._failureReason,
      createdAt: this._createdAt,
    };
  }
}
