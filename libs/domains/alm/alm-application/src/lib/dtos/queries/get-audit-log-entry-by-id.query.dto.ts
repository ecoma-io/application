import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * DTO cho truy vấn lấy một bản ghi kiểm tra theo ID
 */
export class GetAuditLogEntryByIdQueryDto {
  /**
   * ID của bản ghi kiểm tra cần lấy
   */
  @IsNotEmpty({ message: 'ID bản ghi không được để trống' })
  @IsUUID('4', { message: 'ID bản ghi phải là UUID hợp lệ' })
  id!: string;
}
