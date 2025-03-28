/**
 * TransactionType Value Object đại diện cho loại giao dịch trong hệ thống thanh toán
 */
export enum TransactionTypeEnum {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
}

export class TransactionType {
  private constructor(private readonly _value: TransactionTypeEnum) {}

  /**
   * Tạo đối tượng TransactionType đại diện cho giao dịch thanh toán
   * @returns TransactionType với giá trị PAYMENT
   */
  public static payment(): TransactionType {
    return new TransactionType(TransactionTypeEnum.PAYMENT);
  }

  /**
   * Tạo đối tượng TransactionType đại diện cho giao dịch hoàn tiền
   * @returns TransactionType với giá trị REFUND
   */
  public static refund(): TransactionType {
    return new TransactionType(TransactionTypeEnum.REFUND);
  }

  /**
   * Tạo đối tượng TransactionType từ một giá trị chuỗi
   * @param value - Giá trị chuỗi ('PAYMENT' hoặc 'REFUND')
   * @returns TransactionType tương ứng
   * @throws Error nếu giá trị không hợp lệ
   */
  public static fromString(value: string): TransactionType {
    const upperValue = value.toUpperCase();

    if (upperValue === TransactionTypeEnum.PAYMENT) {
      return TransactionType.payment();
    } else if (upperValue === TransactionTypeEnum.REFUND) {
      return TransactionType.refund();
    }

    throw new Error(`Giá trị loại giao dịch không hợp lệ: ${value}`);
  }

  /**
   * Lấy giá trị của TransactionType
   */
  public get value(): TransactionTypeEnum {
    return this._value;
  }

  /**
   * Kiểm tra xem TransactionType có phải là giao dịch thanh toán không
   */
  public isPayment(): boolean {
    return this._value === TransactionTypeEnum.PAYMENT;
  }

  /**
   * Kiểm tra xem TransactionType có phải là giao dịch hoàn tiền không
   */
  public isRefund(): boolean {
    return this._value === TransactionTypeEnum.REFUND;
  }

  /**
   * So sánh với một đối tượng TransactionType khác
   * @param other - Đối tượng TransactionType cần so sánh
   * @returns true nếu hai đối tượng TransactionType bằng nhau
   */
  public equals(other: TransactionType): boolean {
    if (!(other instanceof TransactionType)) {
      return false;
    }

    return this._value === other.value;
  }

  /**
   * Chuyển đổi thành chuỗi
   * @returns Giá trị dưới dạng chuỗi
   */
  public toString(): string {
    return this._value;
  }
}
