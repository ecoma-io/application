import { UuidId } from '@ecoma/common-domain';

export class AuditLogEntryId extends UuidId {
  public static create(): AuditLogEntryId {
    return new AuditLogEntryId(UuidId.generate().toString());
  }

  public static from(id: string): AuditLogEntryId {
    return new AuditLogEntryId(id);
  }
}
