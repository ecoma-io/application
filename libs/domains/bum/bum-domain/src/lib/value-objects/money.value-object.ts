import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidAmountError } from "../errors/billing.error";

/**
 * Properties for monetary value.
 */
export interface IMoneyProps {
  amount: number;
  currency: string;
}

/**
 * Represents a monetary value in the system.
 * @extends {AbstractValueObject<IMoneyProps>}
 */
export class Money extends AbstractValueObject<IMoneyProps> {
  /**
   * Creates a new Money instance.
   * @param props - The money properties
   * @throws {InvalidAmountError} If the amount is invalid
   */
  constructor(props: IMoneyProps) {
    super(props);
    this.validate();
  }

  /**
   * Validates the money value.
   * @throws {InvalidAmountError} If the amount is invalid
   */
  private validate(): void {
    if (this.props.amount < 0) {
      throw new InvalidAmountError("Amount cannot be negative");
    }
  }

  /**
   * Adds another money value to this one.
   * @param money - The money value to add
   * @returns A new Money instance with the sum
   * @throws {InvalidAmountError} If the currencies don't match
   */
  add(money: Money): Money {
    if (this.props.currency !== money.currency) {
      throw new InvalidAmountError(
        "Cannot add money with different currencies"
      );
    }
    return new Money({
      amount: this.props.amount + money.amount,
      currency: this.props.currency,
    });
  }

  /**
   * Subtracts another money value from this one.
   * @param money - The money value to subtract
   * @returns A new Money instance with the difference
   * @throws {InvalidAmountError} If the currencies don't match
   */
  subtract(money: Money): Money {
    if (this.props.currency !== money.currency) {
      throw new InvalidAmountError(
        "Cannot subtract money with different currencies"
      );
    }
    return new Money({
      amount: this.props.amount - money.amount,
      currency: this.props.currency,
    });
  }

  /**
   * Multiplies the money value by a factor.
   * @param factor - The multiplication factor
   * @returns A new Money instance with the product
   */
  multiply(factor: number): Money {
    return new Money({
      amount: this.props.amount * factor,
      currency: this.props.currency,
    });
  }

  /**
   * Checks if this money value equals another.
   * @param money - The money value to compare with
   * @returns True if the values are equal
   */
  override equals(money: Money): boolean {
    return (
      this.props.amount === money.amount &&
      this.props.currency === money.currency
    );
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }
}
