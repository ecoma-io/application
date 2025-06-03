import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Role, RoleSchema } from "./role.schema";

@Schema({ timestamps: true, collection: "users" })
export class User {
  @Prop({ trim: true })
  firstName?: string;

  @Prop({ trim: true })
  lastName?: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: RoleSchema }],
    default: [],
  })
  roles: Role[]; // Mảng các ID của roles

  @Prop({ required: true, default: false })
  isVerified: boolean;

  @Prop({ required: true, default: false })
  isSuspended: boolean;

  @Prop()
  createdAt!: Date

  @Prop()
  updatedAt!: Date;

}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
