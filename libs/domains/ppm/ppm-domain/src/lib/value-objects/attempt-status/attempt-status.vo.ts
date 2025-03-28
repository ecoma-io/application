/**
 * AttemptStatus Value Object đại diện cho trạng thái của một lần thử giao dịch
 */
export enum AttemptStatusEnum {
  INITIATED = 'INITIATED',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  ERROR = 'ERROR',
}

export class AttemptStatus {
  private constructor(private readonly _value: AttemptStatusEnum) {}

  /**
   * Tạo đối tượng AttemptStatus với trạng thái INITIATED
   * @returns AttemptStatus với giá trị INITIATED
   */
  public static initiated(): AttemptStatus {
    return new AttemptStatus(AttemptStatusEnum.INITIATED);
  }

  /**
   * Tạo đối tượng AttemptStatus với trạng thái SUCCESS
   * @returns AttemptStatus với giá trị SUCCESS
   */
  public static success(): AttemptStatus {
    return new AttemptStatus(AttemptStatusEnum.SUCCESS);
  }

  /**
   * Tạo đối tượng AttemptStatus với trạng thái FAILURE
   * @returns AttemptStatus với giá trị FAILURE
   */
  public static failure(): AttemptStatus {
    return new AttemptStatus(AttemptStatusEnum.FAILURE);
  }

  /**
   * Tạo đối tượng AttemptStatus với trạng thái ERROR
   * @returns AttemptStatus với giá trị ERROR
   */
  public static error(): AttemptStatus {
    return new AttemptStatus(AttemptStatusEnum.ERROR);
  }

  /**
   * Tạo đối tượng AttemptStatus từ một giá trị chuỗi
   * @param value - Giá trị chuỗi trạng thái
   * @returns AttemptStatus tương ứng
   * @throws Error nếu giá trị không hợp lệ
   */
  public static fromString(value: string): AttemptStatus {
    const upperValue = value.toUpperCase();

    switch (upperValue) {
      case AttemptStatusEnum.INITIATED:
        return AttemptStatus.initiated();
      case AttemptStatusEnum.SUCCESS:
        return AttemptStatus.success();
      case AttemptStatusEnum.FAILURE:
        return AttemptStatus.failure();
      case AttemptStatusEnum.ERROR:
        return AttemptStatus.error();
      default:
        throw new Error(`Giá trị trạng thái lần thử không hợp lệ: ${value}`);
    }
  }

  /**
   * Lấy giá trị của AttemptStatus
   */
  public get value(): AttemptStatusEnum {
    return this._value;
  }

  /**
   * Kiểm tra xem attempt có ở trạng thái initiated không
   */
  public isInitiated(): boolean {
    return this._value === AttemptStatusEnum.INITIATED;
  }

  /**
   * Kiểm tra xem attempt có ở trạng thái success không
   */
  public isSuccess(): boolean {
    return this._value === AttemptStatusEnum.SUCCESS;
  }

  /**
   * Kiểm tra xem attempt có ở trạng thái failure không
   */
  public isFailure(): boolean {
    return this._value === AttemptStatusEnum.FAILURE;
  }

  /**
   * Kiểm tra xem attempt có ở trạng thái error không
   */
  public isError(): boolean {
    return this._value === AttemptStatusEnum.ERROR;
  }

  /**
   * Kiểm tra xem attempt đã hoàn thành chưa (thành công, thất bại hoặc lỗi)
   */
  public isCompleted(): boolean {
    return (
      this._value === AttemptStatusEnum.SUCCESS ||
      this._value === AttemptStatusEnum.FAILURE ||
      this._value === AttemptStatusEnum.ERROR
    );
  }

  /**
   * So sánh với một đối tượng AttemptStatus khác
   * @param other - Đối tượng AttemptStatus cần so sánh
   * @returns true nếu hai đối tượng AttemptStatus bằng nhau
   */
  public equals(other: AttemptStatus): boolean {
    if (!(other instanceof AttemptStatus)) {
      return false;
    }

    return this._value === other.value;
  }

  /**
   * Chuyển đối tượng AttemptStatus thành chuỗi
   */
  public toString(): string {
    return this._value;
  }
}
