import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Định nghĩa schema cho RetentionPolicyEntity.
 * @param collection Tên của collection trong MongoDB.
 * @param timestamps Tùy chọn để tự động thêm timestamp vào document.
 */
@Schema({
  collection: 'retention_policies',
  timestamps: true,
})
/**
 * Lớp đại diện cho một chính sách lưu trữ.
 * @extends Document
 */
export class RetentionPolicyEntity extends Document {
  /**
   * ID của chính sách lưu trữ.
   * @type {string}
   */
  @Prop({ required: true, index: true })
  override id!: string;

  /**
   * ID của người thuê.
   * @type {string}
   */
  @Prop({ index: true })
  tenantId?: string;

  /**
   * Tên của chính sách lưu trữ.
   * @type {string}
   */
  @Prop({ required: true })
  name!: string;

  /**
   * Mô tả của chính sách lưu trữ.
   * @type {string}
   */
  @Prop()
  description?: string;

  /**
   * ID của bounded context.
   * @type {string}
   */
  @Prop({ index: true })
  boundedContext?: string;

  /**
   * Loại hành động áp dụng chính sách.
   * @type {string}
   */
  @Prop({ index: true })
  actionType?: string;

  /**
   * Loại thực thể áp dụng chính sách.
   * @type {string}
   */
  @Prop({ index: true })
  entityType?: string;

  /**
   * Số ngày lưu trữ.
   * @type {number}
   */
  @Prop({ required: true })
  retentionDays!: number;

  /**
   * Trạng thái hoạt động của chính sách.
   * @type {boolean}
   */
  @Prop({ required: true, default: false })
  isActive!: boolean;

  /**
   * Người tạo chính sách.
   * @type {Date}
   */
  @Prop({ type: Date, required: true })
  createdAt!: Date;

  /**
   * Người cập nhật chính sách.
   * @type {Date}
   */
  @Prop({ type: Date })
  updatedAt?: Date;
}

/**
 * Tạo schema cho RetentionPolicyEntity.
 */
export const RetentionPolicySchema = SchemaFactory.createForClass(RetentionPolicyEntity);
