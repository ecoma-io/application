import { IAuditLogReadRepository } from "@ecoma/alm-application";
import {
  AuditContext,
  AuditLogEntry,
  AuditLogEntryId,
  IAuditLogEntryProps,
  Initiator,
} from "@ecoma/alm-domain";
import { AbstractMongoReadRepository } from "@ecoma/common-infrastructure";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditLogEntryDocument } from "../schemas";

@Injectable()
export class AuditLogReadRepository
  extends AbstractMongoReadRepository<
    AuditLogEntryDocument,
    AuditLogEntryId,
    IAuditLogEntryProps,
    AuditLogEntry
  >
  implements IAuditLogReadRepository
{
  constructor(
    @InjectModel(AuditLogEntryDocument.name)
    private readonly auditLogModel: Model<AuditLogEntryDocument>
  ) {
    super(auditLogModel);
  }
  protected override toDomainModel(doc: AuditLogEntryDocument): AuditLogEntry {
    return new AuditLogEntry({
      id: new AuditLogEntryId(doc.id),
      timestamp: doc.timestamp,
      boundedContext: doc.boundedContext,
      actionType: doc.actionType,
      category: doc.category,
      entityId: doc.entityId,
      entityType: doc.entityType,
      tenantId: doc.tenantId,
      initiator: new Initiator({
        type: doc.initiator.type,
        name: doc.initiator.name,
        id: doc.initiator.id,
        ipAddress: doc.initiator.ipAddress,
        userAgent: doc.initiator.userAgent,
      }),
      contextData: doc.contextData
        ? new AuditContext(doc.contextData)
        : undefined,
    });
  }
}
