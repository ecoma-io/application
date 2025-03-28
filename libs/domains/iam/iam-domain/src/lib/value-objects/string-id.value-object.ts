import { AbstractId } from '@ecoma/common-domain';
import { InvalidIdError } from '@ecoma/common-domain';

/**
 * Value Object đại diện cho một ID dạng chuỗi.
 * Kế thừa từ AbstractId để đảm bảo cấu trúc và so sánh dựa trên giá trị chuỗi.
 * 
 * @since 1.0.0
 */
export class StringId extends AbstractId {
  /**
   * Tạo một instance mới của StringId.
   * 
   * @param value - Giá trị chuỗi của ID
   * @throws InvalidIdError - Nếu giá trị không hợp lệ
   */
  constructor(value: string) {
    super(value);
    if (!value || value.trim().length === 0) {
      throw new InvalidIdError('ID không được để trống');
    }
  }

  /**
   * Tạo một StringId mới từ giá trị chuỗi.
   * 
   * @param value - Giá trị chuỗi của ID
   * @returns StringId - Instance mới của StringId
   */
  static create(value: string): StringId {
    return new StringId(value);
  }
} 