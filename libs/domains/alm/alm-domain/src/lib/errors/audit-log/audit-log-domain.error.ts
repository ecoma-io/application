import { DomainError } from "@ecoma/common-domain";
import { Maybe, Primitive } from "@ecoma/common-types";

/**
 * Lỗi cơ sở cho domain ALM
 *
 * Kế thừa từ DomainError của common-domain
 */
export class AuditLogDomainError<
  TDetails = unknown,
  TInterpolationParams extends Record<string, Maybe<Primitive>> = Record<
    string,
    Maybe<Primitive>
  >
> extends DomainError<TDetails, TInterpolationParams> {
  constructor(
    message: string,
    interpolationParams?: TInterpolationParams,
    details?: TDetails
  ) {
    super(message, interpolationParams, details);
  }
}
