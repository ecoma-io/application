import { DomainError } from "@ecoma/common-domain";

/**
 * Error thrown when an invalid permission scope is provided.
 */
export class InvalidPermissionScopeError extends DomainError {
  constructor(scope: string) {
    super("Invalid permission scope", { scope });
  }
}
