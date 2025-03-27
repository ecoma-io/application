import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ id: false })
class InitiatorSchema {
  @Prop({ required: true })
  type: string;

  @Prop()
  id?: string;

  @Prop({ required: true })
  name: string;
}

@Schema({
  collection: "audit_log_entries",
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AuditLog extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop()
  eventId?: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: InitiatorSchema, required: true })
  initiator: {
    type: string;
    id?: string;
    name: string;
  };

  @Prop({ required: true })
  actionType: string;

  @Prop()
  category?: string;

  @Prop()
  severity?: string;

  @Prop()
  entityId?: string;

  @Prop()
  entityType?: string;

  @Prop()
  boundedContext?: string;

  @Prop()
  tenantId?: string;

  @Prop({ type: Map, of: "mixed", default: {} })
  contextData?: Map<string, unknown>;

  @Prop({ required: true, enum: ["Success", "Failure"] })
  status: string;

  @Prop()
  failureReason?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// Indexes
AuditLogSchema.index({ tenantId: 1, timestamp: -1 });
AuditLogSchema.index({ boundedContext: 1, timestamp: -1 });
AuditLogSchema.index({ actionType: 1, timestamp: -1 });
AuditLogSchema.index({ entityId: 1, timestamp: -1 });
AuditLogSchema.index({ entityType: 1, timestamp: -1 });
AuditLogSchema.index({ status: 1, timestamp: -1 });
AuditLogSchema.index({ "initiator.type": 1, timestamp: -1 });
AuditLogSchema.index({ "initiator.id": 1, timestamp: -1 });
AuditLogSchema.index({ timestamp: -1 });
