import {
  AbstractDomainEvent,
  IDomainEventMetadata,
} from "@ecoma/common-domain";

export class AuditLogEntryPersistedEvent extends AbstractDomainEvent {
  constructor(timestamp?: Date, metadata?: IDomainEventMetadata, id?: string) {
    super(timestamp, metadata, id);
  }
}
