import { InvalidIdError } from "../../errors";
import { AbstractId } from "./base-id";
import { v7 as uuidv7 } from 'uuid';

/**
 * Value Object đại diện cho một UUID làm ID.
 * Kế thừa từ BaseId để đảm bảo cấu trúc và so sánh dựa trên giá trị chuỗi.
 */
export class UuidId extends AbstractId {
  // Có thể thêm validation cụ thể cho định dạng UUID ở đây nếu cần
  // Ví dụ: kiểm tra regex
  constructor(value: string) {
    super(value);
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new InvalidIdError(`Invalid UUID format: ${value}`);
    }
  }

  // Có thể thêm static factory method để tạo UUID mới
  static generate(): UuidId {
    return new UuidId(uuidv7());
  }
}
