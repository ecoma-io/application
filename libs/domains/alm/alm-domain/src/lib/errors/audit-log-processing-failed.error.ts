import { DomainError } from "@ecoma/common-domain";

export class AuditLogProcessingFailedError extends DomainError<{
  eventId: string;
}> {
  constructor(eventId: string) {
    super(
      `Failed to process audit log event ${eventId}`,
      { eventId },
      { eventId }
    );
  }
}
