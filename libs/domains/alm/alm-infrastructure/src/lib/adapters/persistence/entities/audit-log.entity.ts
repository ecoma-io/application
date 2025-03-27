import { Severity, Status } from "@ecoma/alm-domain";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/**
 * Định nghĩa schema cho AuditLogEntity.
 * @param collection Tên của collection trong MongoDB.
 * @param timestamps Tùy chọn để tự động thêm timestamp vào document.
 */
@Schema({
  collection: "audit_logs",
  timestamps: true,
})
/**
 * Lớp đại diện cho một bản ghi kiểm toán.
 * @extends Document
 */
export class AuditLogEntity extends Document {
  /**
   * ID của bản ghi kiểm toán.
   * @type {string}
   */
  @Prop({ required: true, index: true })
  override id!: string;

  /**
   * Thời điểm xảy ra sự kiện.
   * @type {Date}
   */
  @Prop({ required: true })
  timestamp!: Date;

  /**
   * Thông tin về người/hệ thống thực hiện hành động.
   * @type {Record<string, unknown>}
   */
  @Prop({ type: Object, required: true })
  initiator!: Record<string, unknown>;

  /**
   * Bounded context phát sinh sự kiện.
   * @type {string}
   */
  @Prop({ required: true })
  boundedContext!: string;

  /**
   * Loại hành động được thực hiện.
   * @type {string}
   */
  @Prop({ required: true })
  actionType!: string;

  /**
   * Danh mục của bản ghi.
   * @type {string}
   */
  @Prop()
  category?: string;

  /**
   * Mức độ nghiêm trọng.
   * @type {string}
   */
  @Prop({ type: String, enum: Object.values(Severity) })
  severity?: Severity;

  /**
   * ID của thực thể liên quan.
   * @type {string}
   */
  @Prop()
  entityId?: string;

  /**
   * Loại thực thể liên quan.
   * @type {string}
   */
  @Prop()
  entityType?: string;

  /**
   * ID của tenant.
   * @type {string}
   */
  @Prop({ index: true })
  tenantId?: string;

  /**
   * Dữ liệu ngữ cảnh bổ sung.
   * @type {Record<string, unknown>}
   */
  @Prop({ type: Object })
  contextData?: Record<string, unknown>;

  /**
   * Trạng thái xử lý của bản ghi.
   * @type {string}
   */
  @Prop({ type: String, enum: Object.values(Status), required: true })
  status!: Status;

  /**
   * Thông báo lỗi nếu xử lý thất bại.
   * @type {string}
   */
  @Prop()
  errorMessage?: string;

  /**
   * Thời điểm bản ghi được xử lý.
   * @type {Date}
   */
  @Prop()
  processedAt?: Date;

  /**
   * Thời điểm bản ghi được tạo.
   * @type {Date}
   */
  @Prop({ required: true })
  createdAt!: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLogEntity);
