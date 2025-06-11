import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
  timestamps: true, // Tự động thêm createdAt và updatedAt
  collection: "otps", // Tên collection trong MongoDB
})
export class OTP {
  @Prop({
    required: true,
    index: true,
  })
  code: string; // Đây sẽ là mã OTP 6 chữ số

  @Prop({
    type: Types.ObjectId, // Kiểu ObjectId của Mongoose
    ref: "User", // Tham chiếu đến model User
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    expires: 0, // MongoDB sẽ tự động xóa tài liệu sau `expiresAt`
  })
  expiresAt: Date;

  @Prop({ default: false })
  isUsed: boolean;
}

export type OTPDocument = OTP & Document & { createdAt: Date; updatedAt: Date; };
export const OTPSchema = SchemaFactory.createForClass(OTP);

// Quan trọng: Đảm bảo chỉ có một OTP chưa sử dụng cho mỗi người dùng và loại tại một thời điểm.
// Điều này ngăn chặn việc người dùng yêu cầu quá nhiều OTP cùng lúc và gây rối loạn.
OTPSchema.index(
  { userId: 1 },
  { unique: true, partialFilterExpression: { isUsed: false } }
);
