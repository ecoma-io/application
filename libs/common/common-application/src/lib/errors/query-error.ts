import { Maybe, Primitive } from "@ecoma/common-types";
import { ApplicationError } from "./application-error";

export class QueryError extends ApplicationError {

  constructor(message: string, interpolationParams?: Record<string, Maybe<Primitive>>, details?: unknown) {
    super(message, interpolationParams, details);
  }
}


