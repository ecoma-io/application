import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidAddressError } from "../errors/billing.error";

/**
 * Properties for Address value object.
 */
export interface IAddressProps {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  additionalInfo?: string;
}

/**
 * Represents a physical address in the system.
 * @extends {AbstractValueObject<IAddressProps>}
 */
export class Address extends AbstractValueObject<IAddressProps> {
  /**
   * Creates a new Address instance.
   * @param props - The address properties
   * @throws {InvalidAddressError} If any required field is missing or invalid
   */
  constructor(props: IAddressProps) {
    super(props);
    this.validate();
  }

  /**
   * Validates the address fields.
   * @throws {InvalidAddressError} If any required field is missing or invalid
   */
  private validate(): void {
    if (!this.props.street || this.props.street.trim().length === 0) {
      throw new InvalidAddressError("Street is required");
    }

    if (!this.props.city || this.props.city.trim().length === 0) {
      throw new InvalidAddressError("City is required");
    }

    if (!this.props.state || this.props.state.trim().length === 0) {
      throw new InvalidAddressError("State is required");
    }

    if (!this.props.country || this.props.country.trim().length === 0) {
      throw new InvalidAddressError("Country is required");
    }

    if (!this.props.postalCode || this.props.postalCode.trim().length === 0) {
      throw new InvalidAddressError("Postal code is required");
    }
  }

  /**
   * Checks if this address equals another.
   * @param other - The address to compare with
   * @returns True if the addresses are equal
   */
  override equals(other: Address): boolean {
    return (
      this.props.street === other.street &&
      this.props.city === other.city &&
      this.props.state === other.state &&
      this.props.country === other.country &&
      this.props.postalCode === other.postalCode
    );
  }

  /**
   * Converts the address to a formatted string.
   */
  override toString(): string {
    const parts = [
      this.props.street,
      this.props.city,
      this.props.state,
      this.props.country,
      this.props.postalCode,
    ];
    return parts.filter(Boolean).join(", ");
  }

  /**
   * Chuyển đổi thành chuỗi định dạng ngắn gọn.
   */
  toShortString(): string {
    return `${this.props.city}, ${this.props.country}`;
  }

  get street(): string {
    return this.props.street;
  }

  get city(): string {
    return this.props.city;
  }

  get state(): string {
    return this.props.state;
  }

  get country(): string {
    return this.props.country;
  }

  get postalCode(): string {
    return this.props.postalCode;
  }

  get additionalInfo(): string | undefined {
    return this.props.additionalInfo;
  }
}
