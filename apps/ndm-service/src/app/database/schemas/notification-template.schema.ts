import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'notification_templates',
})
export class NotificationTemplate {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  html: string; // Nội dung HTML của email. Sử dụng handlebar template

  @Prop()
  text?: string; // Nội dung text thuần túy của email sử dụng handlebar template (fallback hoặc client không hỗ trợ HTML)

  @Prop([String]) // Mảng các placeholder có thể sử dụng trong mẫu (ví dụ: ['userName', 'orderId'])
  placeholders: string[];

  @Prop()
  description?: string; // Mô tả ngắn gọn về mục đích của mẫu

  @Prop()
  layout?: string; // Tên template layout, ví dụ: 'email template'

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type NotificationTemplateDocument = NotificationTemplate & Document & { createdAt: Date; updatedAt: Date };
export const NotificationTemplateSchema = SchemaFactory.createForClass(NotificationTemplate);
