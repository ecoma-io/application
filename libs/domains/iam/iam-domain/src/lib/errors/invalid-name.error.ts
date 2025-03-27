import { DomainError } from "@ecoma/common-domain";

/**
 * Error thrown when an invalid name is provided.
 */
export class InvalidNameError extends DomainError {
  constructor(
    field: string,
    value: string,
    minLength: number,
    maxLength: number
  ) {
    super("Invalid name", { field, value, minLength, maxLength });
  }
}
