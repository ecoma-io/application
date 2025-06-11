import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true, collection: "roles" })
export class Role {
  @Prop({ required: true, trim: true, unique: true })
  name: string; // Tên của role (e.g., "Product Editor")

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [String], default: [] }) // Mảng các 'groupKey:actionKey'
  permissions: string[];

  @Prop({ type: Number, default: 1 }) // Để xử lý cập nhật role và ảnh hưởng đến session
  version: number;
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);
