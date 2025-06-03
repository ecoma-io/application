import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

 
@Schema({ _id: false }) // No separate _id for subdocuments
export class PermissionAction {
  @Prop({ required: true, trim: true })
  name: string; // Tên quyền hiển thị (e.g., "View", "Edit")

  @Prop({ required: true, trim: true, unique: false }) // Key unique within a group, not globally
  key: string; // Key của quyền (e.g., "view", "edit")

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: [String], default: [] })
  implies: string[]; // Mảng các 'groupKey:actionKey' mà quyền này bao hàm
}

@Schema({ timestamps: true, collection: "permissions" })
export class Permission {
  @Prop({ required: true, trim: true })
  groupName: string; // Tên nhóm quyền (e.g., "Product Manage")

  @Prop({ required: true, trim: true, unique: true })
  groupKey: string; // Key của nhóm quyền, dùng trong code (e.g., "product_manage")

  @Prop({ type: [PermissionAction], default: [] })
  actions: PermissionAction[];
}

export type PermissionDocument = HydratedDocument<Permission>;
export type PermissionActionDocument = HydratedDocument<PermissionAction>;
export const PermissionActionSchema =
  SchemaFactory.createForClass(PermissionAction);
export const PermissionSchema = SchemaFactory.createForClass(Permission);
