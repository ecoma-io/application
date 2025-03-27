import { DomainError } from "@ecoma/common-domain";

/**
 * Represents an error when an invoice with the specified ID is not found.
 * @extends {DomainError}
 */
export class InvoiceNotFoundError extends DomainError {
  constructor(invoiceId: string) {
    super("Invoice not found", { invoiceId });
  }
}

/**
 * Represents an error when a new invoice cannot be created for a specific reason.
 * @extends {DomainError}
 */
export class CannotCreateInvoiceError extends DomainError {
  constructor(reason: string) {
    super("Cannot create invoice", { reason });
  }
}

/**
 * Represents an error when an invoice cannot be updated for a specific reason.
 * @extends {DomainError}
 */
export class CannotUpdateInvoiceError extends DomainError {
  constructor(reason: string) {
    super("Cannot update invoice", { reason });
  }
}

/**
 * Represents an error when an invoice cannot be deleted for a specific reason.
 * @extends {DomainError}
 */
export class CannotDeleteInvoiceError extends DomainError {
  constructor(reason: string) {
    super("Cannot delete invoice", { reason });
  }
}

/**
 * Represents an error when an invoice cannot be cancelled for a specific reason.
 * @extends {DomainError}
 */
export class CannotCancelInvoiceError extends DomainError {
  constructor(reason: string) {
    super("Cannot cancel invoice", { reason });
  }
}

/**
 * Represents an error when an invoice cannot be refunded for a specific reason.
 * @extends {DomainError}
 */
export class CannotRefundInvoiceError extends DomainError {
  constructor(reason: string) {
    super("Cannot refund invoice", { reason });
  }
}

/**
 * Represents an error when an amount is invalid.
 * @extends {DomainError}
 */
export class InvalidAmountError extends DomainError {
  constructor(message: string) {
    super("Invalid amount", { message });
  }
}

/**
 * Represents an error when a duration is invalid.
 * @extends {DomainError}
 */
export class InvalidDurationError extends DomainError {
  constructor(value: number, unit: string) {
    super("Invalid duration", { value: value.toString(), unit });
  }
}

/**
 * Represents an error when a usage quantity is invalid.
 * @extends {DomainError}
 */
export class InvalidUsageQuantityError extends DomainError {
  constructor(value: number, unit: string, reason: string) {
    super("Invalid usage quantity", { value: value.toString(), unit, reason });
  }
}

/**
 * Represents an error when a feature type is invalid.
 * @extends {DomainError}
 */
export class InvalidFeatureTypeError extends DomainError {
  constructor(code: string, reason: string) {
    super("Invalid feature type", { code, reason });
  }
}

/**
 * Represents an error when a resource type is invalid.
 * @extends {DomainError}
 */
export class InvalidResourceTypeError extends DomainError {
  constructor(code: string, reason: string) {
    super("Invalid resource type", { code, reason });
  }
}

/**
 * Represents an error when a billing cycle period is invalid.
 * @extends {DomainError}
 */
export class InvalidBillingCyclePeriodError extends DomainError {
  constructor(reason: string) {
    super("Invalid billing cycle period", { reason });
  }
}

/**
 * Represents an error when a pricing component is invalid.
 * @extends {DomainError}
 */
export class InvalidPricingComponentError extends DomainError {
  constructor(type: string, reason: string) {
    super("Invalid pricing component", { type, reason });
  }
}

/**
 * Represents an error when an address is invalid.
 * @extends {DomainError}
 */
export class InvalidAddressError extends DomainError {
  constructor(reason: string) {
    super("Invalid address", { reason });
  }
}
