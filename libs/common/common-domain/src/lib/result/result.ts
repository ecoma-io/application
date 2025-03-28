/**
 * @fileoverview Class kết quả chung để xử lý success/failure
 * @since 1.0.0
 */

/**
 * Class kết quả để xử lý thành công / thất bại
 * @template T - Kiểu dữ liệu của kết quả
 */
export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private error: string;
  private _value: T;

  /**
   * Constructor riêng tư. Sử dụng các phương thức static factory
   */
  private constructor(isSuccess: boolean, error?: string, value?: T) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: Kết quả thành công không thể có lỗi');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: Kết quả thất bại phải có lỗi');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error as string;
    this._value = value as T;

    Object.freeze(this);
  }

  /**
   * Trả về giá trị nếu Result là thành công
   * @throws {Error} Nếu Result là thất bại
   */
  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Can't get the value of an error result. Error: ${this.error}`);
    }

    return this._value;
  }

  /**
   * Tạo Result thành công
   * @param value - Giá trị kết quả
   */
  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  /**
   * Tạo Result thất bại
   * @param error - Thông báo lỗi
   */
  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  /**
   * Kết hợp nhiều Result
   * @param results - Danh sách Result để kết hợp
   */
  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
