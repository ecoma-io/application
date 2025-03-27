import { DataTransferObject } from "../dto";

/**
 * @interface IGenericResult
 * @description DTO chứa kết quả trả về từ hệ thống.
 * @template TData - Kiểu dữ liệu của dữ liệu trả về.
 * @template TDetails - Kiểu dữ liệu của chi tiết lỗi.
 */
export class GenericResult<
  TData,
  TDetails = unknown
> extends DataTransferObject {
  /**
   * @property success
   * @description Trạng thái thành công của hệ thống.
   */
  readonly success!: boolean;

  /**
   * @property error
   * @description Thông báo lỗi.
   */
  readonly error?: string;

  /**
   * @property details
   * @description
   *   Chi tiết lỗi. Trường này có thể chứa thông tin bổ sung về lỗi, ví dụ:
   *   - Danh sách lỗi validation cho từng trường (dùng để hiển thị lỗi trên form frontend)
   *   - Thông tin chi tiết về nguyên nhân lỗi (stack trace, context, ...)
   *   - Có thể là object, string, hoặc bất kỳ kiểu nào phù hợp với use-case
   *   - Nếu là lỗi validation, nên trả về dạng mảng/object gồm các trường và message tương ứng để frontend hiển thị trực tiếp
   *   Ví dụ:
   *   ```ts
   *   details: [
   *     { field: 'email', message: 'Email không hợp lệ' },
   *     { field: 'password', message: 'Mật khẩu quá ngắn' }
   *   ]
   *   ```
   */
  readonly details?: TDetails;

  /**
   * @property data
   * @description Dữ liệu trả về từ hệ thống.
   */
  readonly data?: TData;
}
