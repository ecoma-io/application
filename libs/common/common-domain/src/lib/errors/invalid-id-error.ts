import { Maybe, Primitive } from "@ecoma/common-types";
import { DomainError } from "./domain-error";

export class InvalidIdError extends DomainError {

  constructor(message: string, interpolationParams?: Record<string, Maybe<Primitive>>) {
    super(message, interpolationParams);
  }
}


