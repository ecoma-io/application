import { IAuditLogWriteRepository } from "@ecoma/alm-application";
import { AuditLogEntry, AuditLogEntryId } from "@ecoma/alm-domain";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditLogEntryDocument } from "../schemas";

@Injectable()
export class AuditLogWriteRepository implements IAuditLogWriteRepository {
  constructor(
    @InjectModel(AuditLogEntryDocument.name)
    private readonly auditLogModel: Model<AuditLogEntryDocument>
  ) {}

  async save(aggregateRoot: AuditLogEntry): Promise<void> {
    const plain = this.toPersistence(aggregateRoot);
    await this.auditLogModel.updateOne({ id: plain["id"] }, plain, {
      upsert: true,
    });
  }

  async delete(id: AuditLogEntryId): Promise<void> {
    await this.auditLogModel.deleteOne({ id: id.toString() });
  }

  async deleteMany(ids: AuditLogEntryId[]): Promise<void> {
    await this.auditLogModel.deleteMany({
      id: { $in: ids.map((i) => i.toString()) },
    });
  }

  private toPersistence(aggregateRoot: AuditLogEntry): Record<string, unknown> {
    const result = {
      id: aggregateRoot.id.toString(),
      initiator: JSON.parse(JSON.stringify(aggregateRoot.initiator)),
      timestamp: aggregateRoot.timestamp,
      boundedContext: aggregateRoot.boundedContext,
      actionType: aggregateRoot.actionType,
      category: aggregateRoot.category,
      entityId: aggregateRoot.entityId,
      entityType: aggregateRoot.entityType,
      tenantId: aggregateRoot.tenantId,
      contextData: aggregateRoot.contextData
        ? aggregateRoot.contextData.getAll()
        : undefined,
    };
    return result;
  }
}
