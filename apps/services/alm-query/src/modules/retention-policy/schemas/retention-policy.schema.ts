import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
  collection: "retention_policies",
  timestamps: true,
  versionKey: false,
})
export class RetentionPolicy extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  tenantId?: string;

  @Prop({ required: true })
  businessContextId: string;

  @Prop({ required: true, min: 1 })
  retentionPeriodDays: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Object })
  conditions?: Record<string, unknown>;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const RetentionPolicySchema =
  SchemaFactory.createForClass(RetentionPolicy);
