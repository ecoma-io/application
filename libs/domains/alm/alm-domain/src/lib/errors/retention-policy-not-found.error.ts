import { DomainError } from "@ecoma/common-domain";

export class RetentionPolicyNotFoundError extends DomainError<{ id: string }> {
  constructor(id: string) {
    super(`Retention policy with ID "${id}" not found`, { id }, { id });
  }
}
