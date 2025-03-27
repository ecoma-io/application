import {
  AbstractDomainEvent,
  IDomainEventMetadata,
} from "@ecoma/common-domain";

/**
 * Event emitted when a user is deactivated.
 */
export class UserDeactivatedEvent extends AbstractDomainEvent {
  constructor(
    public readonly userId: string,
    timestamp?: Date,
    metadata?: IDomainEventMetadata,
    id?: string
  ) {
    super(timestamp, metadata, id);
  }
}
