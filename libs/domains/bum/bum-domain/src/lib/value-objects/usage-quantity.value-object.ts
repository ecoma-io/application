import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidUsageQuantityError } from "../errors/billing.error";

/**
 * Unit of measurement for resource usage.
 */
export enum UsageUnit {
  COUNT = "COUNT", // Count of units
  BYTES = "BYTES", // Storage capacity
  SECONDS = "SECONDS", // Time duration
  REQUESTS = "REQUESTS", // Number of requests
  PERCENTAGE = "PERCENTAGE", // Percentage value
}

/**
 * Props interface for UsageQuantity value object
 */
export interface IUsageQuantityProps {
  value: number;
  unit: UsageUnit;
}

/**
 * Represents a quantity of resource usage in the system.
 * @extends {AbstractValueObject<IUsageQuantityProps>}
 */
export class UsageQuantity extends AbstractValueObject<IUsageQuantityProps> {
  /**
   * Creates a new UsageQuantity instance.
   * @param props - The usage quantity properties
   * @throws {InvalidUsageQuantityError} If the value is invalid
   */
  constructor(props: IUsageQuantityProps) {
    super(props);
    this.validate();
  }

  /**
   * Validates the usage quantity value.
   * @throws {InvalidUsageQuantityError} If the value is invalid
   */
  private validate(): void {
    if (this.props.value < 0) {
      throw new InvalidUsageQuantityError(
        this.props.value,
        this.props.unit,
        "Usage quantity cannot be negative"
      );
    }

    if (this.props.unit === UsageUnit.PERCENTAGE && this.props.value > 100) {
      throw new InvalidUsageQuantityError(
        this.props.value,
        this.props.unit,
        "Percentage value cannot exceed 100"
      );
    }
  }

  /**
   * Gets the numeric value of the usage quantity.
   */
  get value(): number {
    return this.props.value;
  }

  /**
   * Gets the unit of the usage quantity.
   */
  get unit(): UsageUnit {
    return this.props.unit;
  }

  /**
   * Adds another usage quantity to this one.
   * @param other - The usage quantity to add
   * @returns A new UsageQuantity instance with the sum
   * @throws {InvalidUsageQuantityError} If the units don't match
   */
  add(other: UsageQuantity): UsageQuantity {
    if (this.props.unit !== other.unit) {
      throw new InvalidUsageQuantityError(
        this.props.value,
        this.props.unit,
        "Cannot add quantities with different units"
      );
    }

    return new UsageQuantity({
      value: this.props.value + other.value,
      unit: this.props.unit,
    });
  }

  /**
   * Subtracts another usage quantity from this one.
   * @param other - The usage quantity to subtract
   * @returns A new UsageQuantity instance with the difference
   * @throws {InvalidUsageQuantityError} If the units don't match
   */
  subtract(other: UsageQuantity): UsageQuantity {
    if (this.props.unit !== other.unit) {
      throw new InvalidUsageQuantityError(
        this.props.value,
        this.props.unit,
        "Cannot subtract quantities with different units"
      );
    }

    return new UsageQuantity({
      value: this.props.value - other.value,
      unit: this.props.unit,
    });
  }

  /**
   * Multiplies the usage quantity by a factor.
   * @param factor - The multiplication factor
   * @returns A new UsageQuantity instance with the product
   */
  multiply(factor: number): UsageQuantity {
    return new UsageQuantity({
      value: this.props.value * factor,
      unit: this.props.unit,
    });
  }

  /**
   * Checks if this usage quantity equals another.
   * @param other - The usage quantity to compare with
   * @returns True if the quantities are equal
   */
  override equals(other: UsageQuantity): boolean {
    return this.props.value === other.value && this.props.unit === other.unit;
  }

  /**
   * Checks if this usage quantity exceeds a limit.
   * @param limit - The limit to check against
   * @returns True if this quantity exceeds the limit
   * @throws {InvalidUsageQuantityError} If units don't match
   */
  exceedsLimit(limit: UsageQuantity): boolean {
    if (this.props.unit !== limit.unit) {
      throw new InvalidUsageQuantityError(
        this.props.value,
        this.props.unit,
        "Cannot compare quantities with different units"
      );
    }
    return this.props.value > limit.value;
  }

  /**
   * Returns a string representation of the usage quantity.
   * @returns The string representation
   */
  override toString(): string {
    return `${this.props.value} ${this.props.unit}`;
  }
}
