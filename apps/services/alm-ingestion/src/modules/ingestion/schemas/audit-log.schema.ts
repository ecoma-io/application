import { Schema } from "mongoose";

const initiatorSchema = new Schema(
  {
    type: { type: String, required: true },
    id: { type: String },
    name: { type: String, required: true },
  },
  { id: false }
);

export const AuditLogSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    eventId: { type: String },
    timestamp: { type: Date, required: true },
    initiator: { type: initiatorSchema, required: true },
    actionType: { type: String, required: true },
    category: { type: String },
    severity: { type: String },
    entityId: { type: String },
    entityType: { type: String },
    boundedContext: { type: String },
    tenantId: { type: String },
    contextData: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      required: true,
      enum: ["Success", "Failure"],
    },
    failureReason: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "audit_log_entries",
    timestamps: true,
    versionKey: false,
  }
);

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
