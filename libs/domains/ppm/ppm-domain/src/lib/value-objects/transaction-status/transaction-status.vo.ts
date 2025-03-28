/**
 * TransactionStatus Value Object đại diện cho trạng thái của một giao dịch
 */
export enum TransactionStatusEnum {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  CANCELLED = 'CANCELLED',
}

export class TransactionStatus {
  private constructor(private readonly _value: TransactionStatusEnum) {}

  /**
   * Tạo đối tượng TransactionStatus với trạng thái PENDING
   * @returns TransactionStatus với giá trị PENDING
   */
  public static pending(): TransactionStatus {
    return new TransactionStatus(TransactionStatusEnum.PENDING);
  }

  /**
   * Tạo đối tượng TransactionStatus với trạng thái SUCCESSFUL
   * @returns TransactionStatus với giá trị SUCCESSFUL
   */
  public static successful(): TransactionStatus {
    return new TransactionStatus(TransactionStatusEnum.SUCCESSFUL);
  }

  /**
   * Tạo đối tượng TransactionStatus với trạng thái FAILED
   * @returns TransactionStatus với giá trị FAILED
   */
  public static failed(): TransactionStatus {
    return new TransactionStatus(TransactionStatusEnum.FAILED);
  }

  /**
   * Tạo đối tượng TransactionStatus với trạng thái REFUNDED
   * @returns TransactionStatus với giá trị REFUNDED
   */
  public static refunded(): TransactionStatus {
    return new TransactionStatus(TransactionStatusEnum.REFUNDED);
  }

  /**
   * Tạo đối tượng TransactionStatus với trạng thái PARTIALLY_REFUNDED
   * @returns TransactionStatus với giá trị PARTIALLY_REFUNDED
   */
  public static partiallyRefunded(): TransactionStatus {
    return new TransactionStatus(TransactionStatusEnum.PARTIALLY_REFUNDED);
  }

  /**
   * Tạo đối tượng TransactionStatus với trạng thái CANCELLED
   * @returns TransactionStatus với giá trị CANCELLED
   */
  public static cancelled(): TransactionStatus {
    return new TransactionStatus(TransactionStatusEnum.CANCELLED);
  }

  /**
   * Tạo đối tượng TransactionStatus từ một giá trị chuỗi
   * @param value - Giá trị chuỗi trạng thái
   * @returns TransactionStatus tương ứng
   * @throws Error nếu giá trị không hợp lệ
   */
  public static fromString(value: string): TransactionStatus {
    const upperValue = value.toUpperCase();

    switch (upperValue) {
      case TransactionStatusEnum.PENDING:
        return TransactionStatus.pending();
      case TransactionStatusEnum.SUCCESSFUL:
        return TransactionStatus.successful();
      case TransactionStatusEnum.FAILED:
        return TransactionStatus.failed();
      case TransactionStatusEnum.REFUNDED:
        return TransactionStatus.refunded();
      case TransactionStatusEnum.PARTIALLY_REFUNDED:
        return TransactionStatus.partiallyRefunded();
      case TransactionStatusEnum.CANCELLED:
        return TransactionStatus.cancelled();
      default:
        throw new Error(`Giá trị trạng thái giao dịch không hợp lệ: ${value}`);
    }
  }

  /**
   * Lấy giá trị của TransactionStatus
   */
  public get value(): TransactionStatusEnum {
    return this._value;
  }

  /**
   * Kiểm tra xem transaction có ở trạng thái pending không
   */
  public isPending(): boolean {
    return this._value === TransactionStatusEnum.PENDING;
  }

  /**
   * Kiểm tra xem transaction có ở trạng thái successful không
   */
  public isSuccessful(): boolean {
    return this._value === TransactionStatusEnum.SUCCESSFUL;
  }

  /**
   * Kiểm tra xem transaction có ở trạng thái failed không
   */
  public isFailed(): boolean {
    return this._value === TransactionStatusEnum.FAILED;
  }

  /**
   * Kiểm tra xem transaction có ở trạng thái refunded không
   */
  public isRefunded(): boolean {
    return this._value === TransactionStatusEnum.REFUNDED;
  }

  /**
   * Kiểm tra xem transaction có ở trạng thái partially refunded không
   */
  public isPartiallyRefunded(): boolean {
    return this._value === TransactionStatusEnum.PARTIALLY_REFUNDED;
  }

  /**
   * Kiểm tra xem transaction có ở trạng thái cancelled không
   */
  public isCancelled(): boolean {
    return this._value === TransactionStatusEnum.CANCELLED;
  }

  /**
   * Kiểm tra xem transaction có thể được hoàn tiền hay không
   */
  public canBeRefunded(): boolean {
    return this._value === TransactionStatusEnum.SUCCESSFUL;
  }

  /**
   * Kiểm tra xem transaction có thể bị hủy hay không
   */
  public canBeCancelled(): boolean {
    return this._value === TransactionStatusEnum.PENDING;
  }

  /**
   * Kiểm tra xem transaction có phải là trạng thái kết thúc hay không
   * @returns true nếu transaction ở trạng thái cuối cùng (không thể thay đổi)
   */
  public isFinalState(): boolean {
    return (
      this._value === TransactionStatusEnum.SUCCESSFUL ||
      this._value === TransactionStatusEnum.FAILED ||
      this._value === TransactionStatusEnum.REFUNDED ||
      this._value === TransactionStatusEnum.CANCELLED
    );
  }

  /**
   * So sánh với một đối tượng TransactionStatus khác
   * @param other - Đối tượng TransactionStatus cần so sánh
   * @returns true nếu hai đối tượng TransactionStatus bằng nhau
   */
  public equals(other: TransactionStatus): boolean {
    if (!(other instanceof TransactionStatus)) {
      return false;
    }

    return this._value === other.value;
  }

  /**
   * Chuyển đối tượng TransactionStatus thành chuỗi
   */
  public toString(): string {
    return this._value;
  }
}
