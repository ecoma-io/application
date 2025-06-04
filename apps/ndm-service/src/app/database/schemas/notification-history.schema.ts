import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose"; // Import Types từ mongoose

export enum NotificationStatus {
  SENT = "sent", // đã được Email Worker gửi thành công tới nhà cung cấp dịch vụ email
  RETRY = "retry", // đã được Email Worker nhận và cố gắng gửi đi, nhưng gặp phải một lỗi tạm thời từ nhà cung cấp dịch vụ email (ESP) hoặc lỗi nội bộ khác cho phép thử lại. Email sẽ được đẩy trở lại hàng đợi (có thể là một hàng đợi trễ) để Email Worker thử lại sau.
  FAILED = "failed", // không thể được gửi đi sau tất cả các lần thử lại, hoặc đã gặp phải một lỗi vĩnh viễn không thể khắc phục được (ví dụ: địa chỉ email không hợp lệ, template không tồn tại, v.v.). Email này sẽ không được gửi đi.
}

// Định nghĩa sub-schema cho lịch sử xử lý/thử lại
@Schema({ _id: false }) // Không tạo _id riêng cho sub-document này
class ProcessingAttempt {
  @Prop({ default: Date.now })
  attemptedAt: Date; // Thời điểm diễn ra lần thử này

  @Prop({
    type: String,
    enum: Object.values(NotificationStatus),
    required: true,
  })
  status: NotificationStatus; // Trạng thái của lần thử này (ví dụ: 'queued', 'sent', 'failed', 'retry')

  @Prop()
  errorMessage?: string; // Chi tiết lỗi nếu lần thử này thất bại
}

@Schema({ collection: "notifications-histories", timestamps: true })
export class NotificationHistory {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId; // ID của người dùng nhận email (reference tới collection Users nếu có)

  @Prop({ required: true, index: true }) // Tạo index để tăng tốc độ tìm kiếm
  email: string; // Địa chỉ email người nhận

  @Prop({ required: true, ref: "NotificationTemplate" })
  templateName: string; // Tên của mẫu email đã được sử dụng (reference tới NotificationTemplate)

  @Prop({ required: true, index: true })
  notificationType: string; // Loại thông báo (ví dụ: 'order_updates', 'promotions')

  @Prop({
    type: String,
    enum: Object.values(NotificationStatus),
    index: true,
  })
  status: NotificationStatus; // Trạng thái gửi (ví dụ: 'sent', 'failed', 'queued')

  @Prop()
  errorMessage?: string; // Chi tiết lỗi lần thử cuối cùng

  @Prop({ type: [ProcessingAttempt] }) // Đây là một mảng các sub-document
  processingAttempts: ProcessingAttempt[];

  @Prop({ type: Object })
  data?: Record<string, unknown>; // Dữ liệu động đã được dùng để điền vào template (ví dụ: { userName: 'John Doe', orderId: '12345' })
}

export type NotificationHistoryDocument = HydratedDocument<NotificationHistory>;
export const NotificationHistorySchema =
  SchemaFactory.createForClass(NotificationHistory);
