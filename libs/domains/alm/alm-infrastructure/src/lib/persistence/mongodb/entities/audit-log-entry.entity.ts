/**
 * @fileoverview Entity đại diện cho một bản ghi audit log trong MongoDB
 * @since 1.0.0
 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Entity đại diện cho một bản ghi audit log
 * @class
 * @since 1.0.0
 */
@Schema({
  collection: 'audit_log_entries',
  timestamps: true,
  versionKey: false,
})
export class AuditLogEntryEntity extends Document {
  /** ID duy nhất của bản ghi audit log */
  @Prop({ type: String, required: true })
  override id!: string;

  /** ID của sự kiện liên quan (nếu có) */
  @Prop({ type: String, required: false })
  eventId: string | null = null;

  /** Thời điểm xảy ra hành động */
  @Prop({ type: Date, required: true })
  timestamp: Date = new Date();

  /**
   * Thông tin về người/hệ thống thực hiện hành động
   * @type {{
   *   type: string;
   *   id: string | null;
   *   name: string;
   * }}
   */
  @Prop({
    type: {
      type: { type: String, required: true },
      id: { type: String },
      name: { type: String, required: true },
    }
  })
  initiator: {
    type: string;
    id: string | null;
    name: string;
  } = {
    type: '',
    id: null,
    name: ''
  };

  /** Tên bounded context của hành động */
  @Prop({ type: String, required: true })
  boundedContext = '';

  /** Loại hành động được thực hiện */
  @Prop({ type: String, required: true })
  actionType = '';

  /** Danh mục của hành động (nếu có) */
  @Prop({ type: String })
  category: string | null = null;

  /** Mức độ nghiêm trọng của hành động (nếu có) */
  @Prop({ type: String })
  severity: string | null = null;

  /** ID của entity liên quan (nếu có) */
  @Prop({ type: String })
  entityId: string | null = null;

  /** Loại entity liên quan (nếu có) */
  @Prop({ type: String })
  entityType: string | null = null;

  /** ID của tenant liên quan (nếu có) */
  @Prop({ type: String })
  tenantId: string | null = null;

  /** Dữ liệu bổ sung của hành động */
  @Prop({ type: Object })
  contextData: Record<string, any> = {};

  /** Trạng thái của hành động */
  @Prop({ type: String, required: true })
  status = '';

  /** Lý do thất bại (nếu có) */
  @Prop({ type: String })
  failureReason: string | null = null;

  /** Thời điểm tạo bản ghi */
  @Prop({ type: Date, required: true })
  createdAt: Date = new Date();
}

/**
 * Schema Mongoose cho AuditLogEntry
 * @const
 */
export const AuditLogEntrySchema = SchemaFactory.createForClass(AuditLogEntryEntity);
