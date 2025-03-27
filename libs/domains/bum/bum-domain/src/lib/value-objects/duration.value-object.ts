import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidDurationError } from "../errors/billing.error";

/**
 * Time unit enumeration.
 */
export enum TimeUnit {
  DAYS = "DAYS",
  WEEKS = "WEEKS",
  MONTHS = "MONTHS",
  YEARS = "YEARS",
}

/**
 * Properties for Duration value object.
 */
export interface IDurationProps {
  value: number;
  unit: TimeUnit;
}

/**
 * Represents a duration of time in the system.
 * @extends {AbstractValueObject<IDurationProps>}
 */
export class Duration extends AbstractValueObject<IDurationProps> {
  /**
   * Creates a new Duration instance.
   * @param props - The duration properties
   * @throws {InvalidDurationError} If the value is invalid
   */
  constructor(props: IDurationProps) {
    super(props);
    this.validate();
  }

  /**
   * Validates the duration value.
   * @throws {InvalidDurationError} If the value is invalid
   */
  private validate(): void {
    if (this.props.value <= 0 || !Number.isInteger(this.props.value)) {
      throw new InvalidDurationError(this.props.value, this.props.unit);
    }
  }

  /**
   * Converts the duration to milliseconds.
   */
  toMilliseconds(): number {
    switch (this.props.unit) {
      case TimeUnit.DAYS:
        return this.props.value * 24 * 60 * 60 * 1000;
      case TimeUnit.WEEKS:
        return this.props.value * 7 * 24 * 60 * 60 * 1000;
      case TimeUnit.MONTHS:
        return this.props.value * 30 * 24 * 60 * 60 * 1000; // Approximate
      case TimeUnit.YEARS:
        return this.props.value * 365 * 24 * 60 * 60 * 1000; // Approximate
    }
  }

  /**
   * Adds this duration to a date.
   * @param date - The date to add to
   * @returns A new Date with the duration added
   */
  addToDate(date: Date): Date {
    const newDate = new Date(date);

    switch (this.props.unit) {
      case TimeUnit.DAYS:
        newDate.setDate(newDate.getDate() + this.props.value);
        break;
      case TimeUnit.WEEKS:
        newDate.setDate(newDate.getDate() + this.props.value * 7);
        break;
      case TimeUnit.MONTHS:
        newDate.setMonth(newDate.getMonth() + this.props.value);
        break;
      case TimeUnit.YEARS:
        newDate.setFullYear(newDate.getFullYear() + this.props.value);
        break;
    }

    return newDate;
  }

  /**
   * Checks if this duration equals another.
   * @param other - The duration to compare with
   * @returns True if the durations are equal
   */
  override equals(other: Duration): boolean {
    return this.toMilliseconds() === other.toMilliseconds();
  }

  get value(): number {
    return this.props.value;
  }

  get unit(): TimeUnit {
    return this.props.unit;
  }
}
