import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/**
 * Schema cho worker locks collection
 */
@Schema({
  collection: "worker_locks",
  versionKey: false,
  timestamps: false,
})
export class WorkerLockDocument extends Document {
  @Prop({ required: true, unique: true })
  name!: string;

  @Prop({ required: true, type: Date })
  expiresAt!: Date;

  @Prop({ required: true, type: Date })
  updatedAt!: Date;
}

export const WorkerLockSchema =
  SchemaFactory.createForClass(WorkerLockDocument);

// Tạo compound index cho name và expiresAt để tối ưu query
WorkerLockSchema.index({ name: 1, expiresAt: 1 });
