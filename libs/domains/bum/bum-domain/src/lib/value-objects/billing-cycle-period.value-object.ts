import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidBillingCyclePeriodError } from "../errors/billing.error";
import { Duration, TimeUnit } from "./duration.value-object";

/**
 * Props interface for BillingCyclePeriod value object
 */
export interface IBillingCyclePeriodProps {
  startDate: Date;
  duration: Duration;
}

/**
 * Represents a billing cycle period in the system.
 * @extends {AbstractValueObject<IBillingCyclePeriodProps>}
 */
export class BillingCyclePeriod extends AbstractValueObject<IBillingCyclePeriodProps> {
  /**
   * Creates a new BillingCyclePeriod instance.
   * @param props - The billing cycle period properties
   * @throws {InvalidBillingCyclePeriodError} If the properties are invalid
   */
  constructor(props: IBillingCyclePeriodProps) {
    super(props);
    this.validate();
  }

  /**
   * Creates a monthly billing cycle period.
   * @param startDate - The start date of the period
   */
  static monthly(startDate: Date): BillingCyclePeriod {
    return new BillingCyclePeriod({
      startDate,
      duration: new Duration({ value: 1, unit: TimeUnit.MONTHS }),
    });
  }

  /**
   * Creates a quarterly billing cycle period.
   * @param startDate - The start date of the period
   */
  static quarterly(startDate: Date): BillingCyclePeriod {
    return new BillingCyclePeriod({
      startDate,
      duration: new Duration({ value: 3, unit: TimeUnit.MONTHS }),
    });
  }

  /**
   * Creates an annual billing cycle period.
   * @param startDate - The start date of the period
   */
  static annually(startDate: Date): BillingCyclePeriod {
    return new BillingCyclePeriod({
      startDate,
      duration: new Duration({ value: 1, unit: TimeUnit.YEARS }),
    });
  }

  /**
   * Validates the billing cycle period properties.
   * @throws {InvalidBillingCyclePeriodError} If the properties are invalid
   */
  private validate(): void {
    BillingCyclePeriod.validateProps(this.props);
  }

  /**
   * Validates the billing cycle period properties.
   * @param props - The properties to validate
   * @throws {InvalidBillingCyclePeriodError} If the properties are invalid
   */
  public static validateProps(props: IBillingCyclePeriodProps): void {
    if (
      !(props.startDate instanceof Date) ||
      isNaN(props.startDate.getTime())
    ) {
      throw new InvalidBillingCyclePeriodError("Invalid start date");
    }
  }

  /**
   * Gets the end date of the billing cycle period.
   */
  get endDate(): Date {
    return this.props.duration.addToDate(this.props.startDate);
  }

  /**
   * Checks if a date is within the billing cycle period.
   * @param date - The date to check
   */
  contains(date: Date): boolean {
    return date >= this.props.startDate && date < this.endDate;
  }

  /**
   * Gets the next billing cycle period.
   */
  getNextPeriod(): BillingCyclePeriod {
    return new BillingCyclePeriod({
      startDate: this.endDate,
      duration: this.props.duration,
    });
  }

  /**
   * Checks if this billing cycle period equals another.
   * @param other - The other billing cycle period to compare
   */
  override equals(other: BillingCyclePeriod): boolean {
    if (!(other instanceof BillingCyclePeriod)) return false;
    return (
      this.props.startDate.getTime() === other.props.startDate.getTime() &&
      this.props.duration.equals(other.props.duration)
    );
  }

  /**
   * Converts the billing cycle period to string.
   */
  override toString(): string {
    return `${this.props.startDate.toISOString()} - ${this.endDate.toISOString()}`;
  }

  get startDate(): Date {
    return new Date(this.props.startDate);
  }

  get duration(): Duration {
    return this.props.duration;
  }
}
