import { AbstractId } from "./base-id";
import { InvalidIdError } from "../../errors";


export class SnowflakeId extends AbstractId {

 
  // Có thể thêm validation cụ thể cho định dạng Snowflake ID ở đây nếu cần
  constructor(value: string) {
    super(value);
    // Thêm validation định dạng Snowflake ID (tùy theo cách generate)
    // Ví dụ: kiểm tra là chuỗi số
    if (!/^\d+$/.test(value)) {
      // Giả định BaseError tồn tại từ common-types
      // throw new BaseError(400, `Invalid Snowflake ID format: ${value}`);
      throw new InvalidIdError(`Invalid Snowflake ID format: ${value}`); // Sử dụng Error tạm thời
    }
  }
  


}
