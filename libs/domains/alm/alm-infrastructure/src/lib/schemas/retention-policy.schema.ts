import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  collection: "retention-policies",
  versionKey: false,
  timestamps: false,
})
export class RetentionPolicyDocument extends Document {
  @Prop({ required: true, unique: true })
  override id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop()
  boundedContext?: string;

  @Prop()
  actionType?: string;

  @Prop()
  entityType?: string;

  @Prop()
  tenantId?: string;

  @Prop({ required: true })
  retentionDays!: number;

  @Prop({ required: true })
  isActive!: boolean;

  @Prop({ required: true })
  createdAt!: Date;

  @Prop()
  updatedAt?: Date;
}

export const RetentionPolicySchema = SchemaFactory.createForClass(
  RetentionPolicyDocument
);
