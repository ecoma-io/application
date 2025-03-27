import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// eslint-disable-next-line @typescript-eslint/naming-convention
@Schema({ versionKey: false, timestamps: false, _id: false })
export class InitiatorSchema {
  @Prop({ required: true, enum: ["User", "System", "Integration"] })
  type!: "User" | "System" | "Integration";

  @Prop({ required: true })
  name!: string;

  @Prop()
  id?: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;
}

@Schema({ collection: "entries", versionKey: false, timestamps: false })
export class AuditLogEntryDocument extends Document {
  @Prop({ required: true, unique: true })
  override id!: string;

  @Prop({ required: true })
  timestamp!: Date;

  @Prop({ required: true, type: InitiatorSchema })
  initiator!: InitiatorSchema;

  @Prop({ required: true })
  boundedContext!: string;

  @Prop({ required: true })
  actionType!: string;

  @Prop()
  category?: string;

  @Prop()
  entityId?: string;

  @Prop()
  entityType?: string;

  @Prop()
  tenantId?: string;

  @Prop({ type: Object })
  contextData?: Record<string, unknown>;
}

export const AuditLogEntrySchema = SchemaFactory.createForClass(
  AuditLogEntryDocument
);
