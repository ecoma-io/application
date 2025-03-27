import { DomainError } from "@ecoma/common-domain";

/**
 * Error thrown when an invalid locale is provided.
 */
export class InvalidLocaleError extends DomainError {
  constructor(value: string) {
    super("Invalid locale", { value });
  }
}
