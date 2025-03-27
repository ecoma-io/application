import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidPricingComponentError } from "../errors/billing.error";
import { Money } from "./money.value-object";

/**
 * Pricing type enumeration.
 */
export enum PricingType {
  FLAT = "FLAT", // Fixed price
  PER_UNIT = "PER_UNIT", // Per unit price
  TIERED = "TIERED", // Tiered pricing
}

/**
 * Properties for PricingTier value object.
 */
export interface IPricingTierProps {
  startQuantity: number;
  endQuantity: number;
  unitPrice: Money;
}

/**
 * Represents a pricing tier in the system.
 * @extends {AbstractValueObject<IPricingTierProps>}
 */
export class PricingTier extends AbstractValueObject<IPricingTierProps> {
  /**
   * Creates a new PricingTier instance.
   * @param props - The pricing tier properties
   * @throws {InvalidPricingComponentError} If any required field is missing or invalid
   */
  constructor(props: IPricingTierProps) {
    super(props);
    this.validate();
  }

  /**
   * Validates the pricing tier properties.
   * @throws {InvalidPricingComponentError} If any required field is missing or invalid
   */
  private validate(): void {
    if (this.props.startQuantity < 0) {
      throw new InvalidPricingComponentError(
        "TIER",
        "Start quantity must be non-negative"
      );
    }

    if (this.props.endQuantity <= this.props.startQuantity) {
      throw new InvalidPricingComponentError(
        "TIER",
        "End quantity must be greater than start quantity"
      );
    }
  }

  get startQuantity(): number {
    return this.props.startQuantity;
  }

  get endQuantity(): number {
    return this.props.endQuantity;
  }

  get unitPrice(): Money {
    return this.props.unitPrice;
  }

  /**
   * Checks if a quantity falls within this tier.
   * @param quantity - The quantity to check
   * @returns True if the quantity falls within this tier
   */
  containsQuantity(quantity: number): boolean {
    return (
      quantity >= this.props.startQuantity && quantity < this.props.endQuantity
    );
  }

  /**
   * Calculates the price for a given quantity within this tier.
   * @param quantity - The quantity to calculate the price for
   * @returns The calculated price
   * @throws {InvalidPricingComponentError} If the quantity is not within the tier range
   */
  calculatePrice(quantity: number): Money {
    if (!this.containsQuantity(quantity)) {
      throw new InvalidPricingComponentError(
        "TIER",
        "Quantity is not within tier range"
      );
    }
    const units = quantity - this.props.startQuantity;
    return this.props.unitPrice.multiply(units);
  }
}

/**
 * Properties for PricingComponent value object.
 */
export interface IPricingComponentProps {
  code: string;
  name: string;
  description: string;
  value: number;
}

/**
 * Represents a pricing component in the system.
 * @extends {AbstractValueObject<IPricingComponentProps>}
 */
export class PricingComponent extends AbstractValueObject<IPricingComponentProps> {
  constructor(props: IPricingComponentProps) {
    super(props);
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get value(): number {
    return this.props.value;
  }

  override equals(other: PricingComponent): boolean {
    return this.props.code === other.code;
  }

  override toString(): string {
    return `${this.props.name} (${this.props.code}): ${this.props.value}`;
  }
}
