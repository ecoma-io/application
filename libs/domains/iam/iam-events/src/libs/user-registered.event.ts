import { AbstractDomainEvent, IDomainEventMetadata } from '@ecoma/common-domain'; // Adjust path



export class UserRegisteredEvent extends AbstractDomainEvent {

  constructor(timestamp?: Date, metadata?: IDomainEventMetadata, id?: string) {
    super(timestamp, metadata, id);
  }
}
