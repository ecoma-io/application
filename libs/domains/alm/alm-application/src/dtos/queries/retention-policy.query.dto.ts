/**
 * DTO cho kết quả truy vấn Retention Policy
 */
export class RetentionPolicyQueryDto {
  /** ID của retention policy */
  id!: string;

  /** Tên của retention policy */
  name!: string;

  /** Mô tả của retention policy */
  description?: string;

  /** Bounded context áp dụng */
  boundedContext?: string;

  /** Loại hành động áp dụng */
  actionType?: string;

  /** Loại thực thể áp dụng */
  entityType?: string;

  /** ID của tenant */
  tenantId?: string;

  /** Số ngày lưu giữ dữ liệu */
  retentionDays!: number;

  /** Trạng thái kích hoạt */
  isActive!: boolean;

  /** Thời điểm tạo */
  createdAt!: Date;

  /** Thời điểm cập nhật cuối */
  updatedAt?: Date;

  /** Phiên bản */
  version!: number;
}
