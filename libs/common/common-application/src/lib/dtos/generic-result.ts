import { IDataTransferObject } from "./dto";


/**
 * @interface IGenericResult
 * @description DTO chứa kết quả trả về từ hệ thống.
 * @template TData - Kiểu dữ liệu của dữ liệu trả về.
 * @template TDetails - Kiểu dữ liệu của chi tiết lỗi.
 */
export interface IGenericResult<TData, TDetails = unknown> extends IDataTransferObject {
  /**
   * @property success
   * @description Trạng thái thành công của hệ thống.
   */
  readonly success: boolean;

  /**
   * @property error
   * @description Thông báo lỗi.
   */
  readonly error: string;

  /**
   * @property error
   * @description Chi tiết lỗi.
   */
  readonly details: TDetails;

  /**
   * @property data
   * @description Dữ liệu trả về từ hệ thống.
   */
  readonly data: TData;
}

