import { DomainError } from "@ecoma/common-domain";

/**
 * Error thrown when an invalid permission value is provided.
 */
export class InvalidPermissionValueError extends DomainError {
  constructor(value: string, message: string) {
    super("Invalid permission value", { value, message });
  }
}
