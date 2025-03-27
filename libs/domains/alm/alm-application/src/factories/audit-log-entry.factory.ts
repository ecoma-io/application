import {
  AuditLogEntry,
  AuditLogEntryId,
  IAuditLogEntryProps,
} from "@ecoma/alm-domain";
import {
  AbstractAggregateFactory,
  IUuidIdFactory,
} from "@ecoma/common-application";

export class AuditLogEntryFactory extends AbstractAggregateFactory<
  AuditLogEntryId,
  IAuditLogEntryProps,
  AuditLogEntry
> {
  constructor(private readonly uuidIdFactory: IUuidIdFactory) {
    super();
  }

  create(props: Omit<IAuditLogEntryProps, "id">): AuditLogEntry {
    const auditLogEntry = new AuditLogEntry({
      ...props,
      id: this.uuidIdFactory.create(),
    });
    return auditLogEntry;
  }
}
