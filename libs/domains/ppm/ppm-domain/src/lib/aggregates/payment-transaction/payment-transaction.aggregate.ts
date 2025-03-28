import { Money } from '../../value-objects/money';
import { TransactionType } from '../../value-objects/transaction-type';
import { TransactionStatus } from '../../value-objects/transaction-status';
import { PaymentMethodType } from '../../value-objects/payment-method-type';
import { PaymentMethodDetails } from '../../value-objects/payment-method-details';
import { PaymentAttempt } from '../../entities/payment-attempt';
import { Refund } from '../../entities/refund';
import { AttemptStatus } from '../../value-objects/attempt-status';
import { PaymentTransactionCreatedEvent } from '../../domain-events/payment-transaction-created.event';
import { PaymentSuccessfulEvent } from '../../domain-events/payment-successful.event';
import { PaymentFailedEvent } from '../../domain-events/payment-failed.event';
import { RefundProcessedEvent } from '../../domain-events/refund-processed.event';
import { RefundFailedEvent } from '../../domain-events/refund-failed.event';
import { v4 as uuidv4 } from 'uuid';

/**
 * PaymentTransaction Aggregate Root
 * Biểu diễn một giao dịch thanh toán hoặc hoàn tiền trong hệ thống
 */
export class PaymentTransaction {
  private _attempts: PaymentAttempt[] = [];
  private _refunds: Refund[] = [];
  private _events: any[] = [];

  private constructor(
    private readonly _id: string,
    private readonly _organizationId: string,
    private readonly _transactionType: TransactionType,
    private _status: TransactionStatus,
    private readonly _amount: Money,
    private readonly _paymentMethodType: PaymentMethodType,
    private readonly _paymentMethodDetails: PaymentMethodDetails,
    private readonly _description: string | null,
    private readonly _metadata: Record<string, any> | null,
    private readonly _externalOrderId: string | null,
    private readonly _externalCustomerId: string | null,
    private readonly _gatewayId: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  /**
   * Tạo mới một PaymentTransaction cho giao dịch thanh toán
   * @param params - Các tham số cần thiết để tạo PaymentTransaction
   * @returns PaymentTransaction - Một PaymentTransaction mới
   */
  public static createPayment(params: {
    organizationId: string;
    amount: Money;
    paymentMethodType: PaymentMethodType;
    paymentMethodDetails: PaymentMethodDetails;
    description?: string;
    metadata?: Record<string, any>;
    externalOrderId?: string;
    externalCustomerId?: string;
    gatewayId: string;
  }): PaymentTransaction {
    const id = uuidv4();
    const now = new Date();

    const transaction = new PaymentTransaction(
      id,
      params.organizationId,
      TransactionType.payment(),
      TransactionStatus.pending(),
      params.amount,
      params.paymentMethodType,
      params.paymentMethodDetails,
      params.description || null,
      params.metadata || null,
      params.externalOrderId || null,
      params.externalCustomerId || null,
      params.gatewayId,
      now,
      now,
    );

    // Thêm sự kiện tạo giao dịch
    transaction._events.push(
      new PaymentTransactionCreatedEvent({
        transactionId: id,
        organizationId: params.organizationId,
        amount: params.amount.toObject(),
        transactionType: TransactionType.payment().toString(),
        status: TransactionStatus.pending().toString(),
        paymentMethodType: params.paymentMethodType.toString(),
        externalOrderId: params.externalOrderId,
        externalCustomerId: params.externalCustomerId,
        gatewayId: params.gatewayId,
        createdAt: now,
      }),
    );

    return transaction;
  }

  /**
   * Khôi phục đối tượng PaymentTransaction từ dữ liệu lưu trữ
   * @param data - Dữ liệu lưu trữ
   * @param attempts - Danh sách các lần thử thanh toán
   * @param refunds - Danh sách các khoản hoàn tiền
   * @returns PaymentTransaction - PaymentTransaction được khôi phục
   */
  public static fromPersistence(
    data: {
      id: string;
      organizationId: string;
      transactionType: string;
      status: string;
      amount: number;
      currency: string;
      paymentMethodType: string;
      paymentMethodDetails: Record<string, any>;
      description?: string;
      metadata?: Record<string, any>;
      externalOrderId?: string;
      externalCustomerId?: string;
      gatewayId: string;
      createdAt: Date;
      updatedAt: Date;
    },
    attempts: {
      id: string;
      attemptDate: Date;
      status: string;
      gatewayResponse?: Record<string, any>;
      failureReason?: string;
      createdAt: Date;
    }[],
    refunds: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      reason?: string;
      description?: string;
      gatewayRefundId?: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  ): PaymentTransaction {
    const transaction = new PaymentTransaction(
      data.id,
      data.organizationId,
      TransactionType.fromString(data.transactionType),
      TransactionStatus.fromString(data.status),
      Money.create(data.amount, data.currency),
      PaymentMethodType.fromString(data.paymentMethodType),
      PaymentMethodDetails.fromObject(data.paymentMethodDetails),
      data.description || null,
      data.metadata || null,
      data.externalOrderId || null,
      data.externalCustomerId || null,
      data.gatewayId,
      data.createdAt,
      data.updatedAt,
    );

    // Khôi phục các lần thử thanh toán
    if (attempts && attempts.length > 0) {
      transaction._attempts = attempts.map(attempt =>
        PaymentAttempt.fromPersistence(attempt)
      );
    }

    // Khôi phục các khoản hoàn tiền
    if (refunds && refunds.length > 0) {
      transaction._refunds = refunds.map(refund =>
        Refund.fromPersistence(refund)
      );
    }

    return transaction;
  }

  /**
   * Thêm một lần thử thanh toán mới
   * @returns ID của lần thử mới
   */
  public addNewAttempt(): string {
    // Kiểm tra xem có thể thêm lần thử mới không
    if (!this._transactionType.isPayment()) {
      throw new Error('Chỉ có thể thêm lần thử cho giao dịch thanh toán');
    }

    if (this._status.isFinalState()) {
      throw new Error('Không thể thêm lần thử cho giao dịch đã ở trạng thái cuối');
    }

    // Tạo ID cho lần thử mới
    const attemptId = uuidv4();

    // Tạo lần thử mới
    const attempt = PaymentAttempt.create(
      attemptId,
      new Date(),
      AttemptStatus.initiated(),
    );

    // Thêm vào danh sách lần thử
    this._attempts.push(attempt);

    return attemptId;
  }

  /**
   * Cập nhật kết quả thành công cho lần thử thanh toán
   * @param attemptId - ID của lần thử cần cập nhật
   * @param gatewayResponse - Phản hồi từ cổng thanh toán
   */
  public markAttemptAsSuccess(
    attemptId: string,
    gatewayResponse: Record<string, any>,
  ): void {
    // Tìm lần thử cần cập nhật
    const attempt = this._findAttempt(attemptId);

    // Cập nhật trạng thái thành công cho lần thử
    attempt.markAsSuccess(gatewayResponse);

    // Cập nhật trạng thái thành công cho giao dịch
    this._status = TransactionStatus.successful();
    this._updatedAt = new Date();

    // Thêm sự kiện thanh toán thành công
    this._events.push(
      new PaymentSuccessfulEvent({
        transactionId: this._id,
        organizationId: this._organizationId,
        amount: this._amount.toObject(),
        paymentMethodType: this._paymentMethodType.toString(),
        gatewayId: this._gatewayId,
        attemptId: attemptId,
        externalOrderId: this._externalOrderId,
        externalCustomerId: this._externalCustomerId,
        processedAt: new Date(),
      }),
    );
  }

  /**
   * Cập nhật kết quả thất bại cho lần thử thanh toán
   * @param attemptId - ID của lần thử cần cập nhật
   * @param failureReason - Lý do thất bại
   * @param gatewayResponse - Phản hồi từ cổng thanh toán (tùy chọn)
   * @param finalAttempt - Có phải là lần thử cuối cùng hay không
   */
  public markAttemptAsFailure(
    attemptId: string,
    failureReason: string,
    gatewayResponse: Record<string, any> | null = null,
    finalAttempt = false,
  ): void {
    // Tìm lần thử cần cập nhật
    const attempt = this._findAttempt(attemptId);

    // Cập nhật trạng thái thất bại cho lần thử
    attempt.markAsFailure(failureReason, gatewayResponse);

    // Nếu là lần thử cuối cùng, cập nhật trạng thái thất bại cho giao dịch
    if (finalAttempt) {
      this._status = TransactionStatus.failed();
      this._updatedAt = new Date();

      // Thêm sự kiện thanh toán thất bại
      this._events.push(
        new PaymentFailedEvent({
          transactionId: this._id,
          organizationId: this._organizationId,
          amount: this._amount.toObject(),
          paymentMethodType: this._paymentMethodType.toString(),
          gatewayId: this._gatewayId,
          attemptId: attemptId,
          externalOrderId: this._externalOrderId,
          externalCustomerId: this._externalCustomerId,
          failureReason: failureReason,
          failedAt: new Date(),
        }),
      );
    }
  }

  /**
   * Cập nhật kết quả lỗi cho lần thử thanh toán
   * @param attemptId - ID của lần thử cần cập nhật
   * @param errorReason - Lý do lỗi
   * @param gatewayResponse - Phản hồi từ cổng thanh toán (tùy chọn)
   * @param finalAttempt - Có phải là lần thử cuối cùng hay không
   */
  public markAttemptAsError(
    attemptId: string,
    errorReason: string,
    gatewayResponse: Record<string, any> | null = null,
    finalAttempt = false,
  ): void {
    // Tìm lần thử cần cập nhật
    const attempt = this._findAttempt(attemptId);

    // Cập nhật trạng thái lỗi cho lần thử
    attempt.markAsError(errorReason, gatewayResponse);

    // Nếu là lần thử cuối cùng, cập nhật trạng thái thất bại cho giao dịch
    if (finalAttempt) {
      this._status = TransactionStatus.failed();
      this._updatedAt = new Date();

      // Thêm sự kiện thanh toán thất bại
      this._events.push(
        new PaymentFailedEvent({
          transactionId: this._id,
          organizationId: this._organizationId,
          amount: this._amount.toObject(),
          paymentMethodType: this._paymentMethodType.toString(),
          gatewayId: this._gatewayId,
          attemptId: attemptId,
          externalOrderId: this._externalOrderId,
          externalCustomerId: this._externalCustomerId,
          failureReason: errorReason,
          failedAt: new Date(),
        }),
      );
    }
  }

  /**
   * Tạo một khoản hoàn tiền mới
   * @param amount - Số tiền hoàn lại
   * @param reason - Lý do hoàn tiền
   * @param description - Mô tả chi tiết (tùy chọn)
   * @returns ID của khoản hoàn tiền mới
   */
  public createRefund(
    amount: Money,
    reason: string,
    description?: string,
  ): string {
    // Kiểm tra điều kiện để tạo khoản hoàn tiền
    if (!this._status.canBeRefunded()) {
      throw new Error(
        'Chỉ có thể hoàn tiền cho giao dịch thanh toán đã thành công',
      );
    }

    // Kiểm tra loại tiền tệ
    if (!this._amount.currency.toLowerCase() === amount.currency.toLowerCase()) {
      throw new Error(
        'Loại tiền hoàn lại phải giống với loại tiền của giao dịch gốc',
      );
    }

    // Kiểm tra số tiền hợp lệ
    const totalRefundedAmount = this._calculateTotalRefundedAmount();
    const remainingAmount = this._amount.subtract(totalRefundedAmount);

    if (amount.amount > remainingAmount.amount) {
      throw new Error(
        'Số tiền hoàn lại không thể vượt quá số tiền còn lại có thể hoàn',
      );
    }

    // Tạo ID cho khoản hoàn tiền mới
    const refundId = uuidv4();

    // Tạo khoản hoàn tiền mới
    const refund = Refund.create(
      refundId,
      amount,
      reason,
      description,
    );

    // Thêm vào danh sách hoàn tiền
    this._refunds.push(refund);

    // Cập nhật trạng thái giao dịch
    if (amount.equals(remainingAmount)) {
      this._status = TransactionStatus.refunded();
    } else {
      this._status = TransactionStatus.partiallyRefunded();
    }

    this._updatedAt = new Date();

    return refundId;
  }

  /**
   * Cập nhật kết quả thành công cho khoản hoàn tiền
   * @param refundId - ID của khoản hoàn tiền cần cập nhật
   * @param gatewayRefundId - ID hoàn tiền từ cổng thanh toán
   */
  public markRefundAsProcessed(
    refundId: string,
    gatewayRefundId: string,
  ): void {
    // Tìm khoản hoàn tiền cần cập nhật
    const refund = this._findRefund(refundId);

    // Cập nhật trạng thái thành công cho khoản hoàn tiền
    refund.markAsProcessed(gatewayRefundId);

    // Thêm sự kiện hoàn tiền thành công
    this._events.push(
      new RefundProcessedEvent({
        transactionId: this._id,
        refundId: refundId,
        organizationId: this._organizationId,
        amount: refund.amount.toObject(),
        gatewayId: this._gatewayId,
        gatewayRefundId: gatewayRefundId,
        externalOrderId: this._externalOrderId,
        externalCustomerId: this._externalCustomerId,
        reason: refund.reason,
        processedAt: new Date(),
      }),
    );
  }

  /**
   * Cập nhật kết quả thất bại cho khoản hoàn tiền
   * @param refundId - ID của khoản hoàn tiền cần cập nhật
   * @param failureReason - Lý do thất bại
   */
  public markRefundAsFailed(
    refundId: string,
    failureReason: string,
  ): void {
    // Tìm khoản hoàn tiền cần cập nhật
    const refund = this._findRefund(refundId);

    // Cập nhật trạng thái thất bại cho khoản hoàn tiền
    refund.markAsFailed(failureReason);

    // Tính toán lại trạng thái giao dịch
    this._recalculateTransactionStatus();

    // Thêm sự kiện hoàn tiền thất bại
    this._events.push(
      new RefundFailedEvent({
        transactionId: this._id,
        refundId: refundId,
        organizationId: this._organizationId,
        amount: refund.amount.toObject(),
        gatewayId: this._gatewayId,
        externalOrderId: this._externalOrderId,
        externalCustomerId: this._externalCustomerId,
        reason: refund.reason,
        failureReason: failureReason,
        failedAt: new Date(),
      }),
    );
  }

  /**
   * Lấy các sự kiện đã được tạo và xóa danh sách
   * @returns Danh sách các sự kiện đã tạo
   */
  public getEvents(): any[] {
    const events = [...this._events];
    this._events = [];
    return events;
  }

  /**
   * Tìm một lần thử thanh toán theo ID
   * @param attemptId - ID của lần thử cần tìm
   * @returns PaymentAttempt - Lần thử tìm thấy
   * @throws Error nếu không tìm thấy
   */
  private _findAttempt(attemptId: string): PaymentAttempt {
    const attempt = this._attempts.find(a => a.id === attemptId);

    if (!attempt) {
      throw new Error(`Không tìm thấy lần thử với ID: ${attemptId}`);
    }

    return attempt;
  }

  /**
   * Tìm một khoản hoàn tiền theo ID
   * @param refundId - ID của khoản hoàn tiền cần tìm
   * @returns Refund - Khoản hoàn tiền tìm thấy
   * @throws Error nếu không tìm thấy
   */
  private _findRefund(refundId: string): Refund {
    const refund = this._refunds.find(r => r.id === refundId);

    if (!refund) {
      throw new Error(`Không tìm thấy khoản hoàn tiền với ID: ${refundId}`);
    }

    return refund;
  }

  /**
   * Tính tổng số tiền đã được hoàn lại thành công
   * @returns Money - Tổng số tiền đã hoàn
   */
  private _calculateTotalRefundedAmount(): Money {
    if (this._refunds.length === 0) {
      return Money.create(0, this._amount.currency);
    }

    return this._refunds
      .filter(refund => refund.isProcessed())
      .reduce(
        (total, refund) => total.add(refund.amount),
        Money.create(0, this._amount.currency),
      );
  }

  /**
   * Tính lại trạng thái giao dịch dựa trên trạng thái các khoản hoàn tiền
   */
  private _recalculateTransactionStatus(): void {
    if (this._refunds.length === 0) {
      return;
    }

    const totalRefundedAmount = this._calculateTotalRefundedAmount();

    if (totalRefundedAmount.amount === 0) {
      this._status = TransactionStatus.successful();
    } else if (totalRefundedAmount.equals(this._amount)) {
      this._status = TransactionStatus.refunded();
    } else {
      this._status = TransactionStatus.partiallyRefunded();
    }

    this._updatedAt = new Date();
  }

  /**
   * Lấy ID của PaymentTransaction
   */
  public get id(): string {
    return this._id;
  }

  /**
   * Lấy ID của tổ chức
   */
  public get organizationId(): string {
    return this._organizationId;
  }

  /**
   * Lấy loại giao dịch
   */
  public get transactionType(): TransactionType {
    return this._transactionType;
  }

  /**
   * Lấy trạng thái giao dịch
   */
  public get status(): TransactionStatus {
    return this._status;
  }

  /**
   * Lấy số tiền giao dịch
   */
  public get amount(): Money {
    return this._amount;
  }

  /**
   * Lấy loại phương thức thanh toán
   */
  public get paymentMethodType(): PaymentMethodType {
    return this._paymentMethodType;
  }

  /**
   * Lấy chi tiết phương thức thanh toán
   */
  public get paymentMethodDetails(): PaymentMethodDetails {
    return this._paymentMethodDetails;
  }

  /**
   * Lấy mô tả giao dịch
   */
  public get description(): string | null {
    return this._description;
  }

  /**
   * Lấy metadata giao dịch
   */
  public get metadata(): Record<string, any> | null {
    return this._metadata;
  }

  /**
   * Lấy ID đơn hàng bên ngoài
   */
  public get externalOrderId(): string | null {
    return this._externalOrderId;
  }

  /**
   * Lấy ID khách hàng bên ngoài
   */
  public get externalCustomerId(): string | null {
    return this._externalCustomerId;
  }

  /**
   * Lấy ID của cổng thanh toán
   */
  public get gatewayId(): string {
    return this._gatewayId;
  }

  /**
   * Lấy thời điểm tạo
   */
  public get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Lấy thời điểm cập nhật
   */
  public get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Lấy danh sách các lần thử thanh toán
   */
  public get attempts(): PaymentAttempt[] {
    return [...this._attempts];
  }

  /**
   * Lấy danh sách các khoản hoàn tiền
   */
  public get refunds(): Refund[] {
    return [...this._refunds];
  }

  /**
   * Chuyển đổi sang dạng plain object để serialization
   */
  public toObject(): {
    id: string;
    organizationId: string;
    transactionType: string;
    status: string;
    amount: { amount: number; currency: string };
    paymentMethodType: string;
    paymentMethodDetails: Record<string, any>;
    description: string | null;
    metadata: Record<string, any> | null;
    externalOrderId: string | null;
    externalCustomerId: string | null;
    gatewayId: string;
    createdAt: Date;
    updatedAt: Date;
    attempts: {
      id: string;
      attemptDate: Date;
      status: string;
      gatewayResponse: Record<string, any> | null;
      failureReason: string | null;
      createdAt: Date;
    }[];
    refunds: {
      id: string;
      amount: { amount: number; currency: string };
      status: string;
      reason: string;
      description: string | null;
      gatewayRefundId: string | null;
      failureReason: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[];
  } {
    return {
      id: this._id,
      organizationId: this._organizationId,
      transactionType: this._transactionType.toString(),
      status: this._status.toString(),
      amount: this._amount.toObject(),
      paymentMethodType: this._paymentMethodType.toString(),
      paymentMethodDetails: this._paymentMethodDetails.toObject(),
      description: this._description,
      metadata: this._metadata,
      externalOrderId: this._externalOrderId,
      externalCustomerId: this._externalCustomerId,
      gatewayId: this._gatewayId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      attempts: this._attempts.map(attempt => attempt.toObject()),
      refunds: this._refunds.map(refund => refund.toObject()),
    };
  }
}
