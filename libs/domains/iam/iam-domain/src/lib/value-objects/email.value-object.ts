import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidEmailError } from "../errors";

interface IEmailProps {
  value: string;
}

/**
 * Represents an email address.
 */
export class Email extends AbstractValueObject<IEmailProps> {
  constructor(value: string) {
    if (!Email.isValidEmail(value)) {
      throw new InvalidEmailError(value);
    }
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }

  /**
   * Gets the domain part of the email address.
   */
  getDomain(): string {
    return this.props.value.split("@")[1];
  }

  /**
   * Gets the username part of the email address.
   */
  getUsername(): string {
    return this.props.value.split("@")[0];
  }

  /**
   * Validates an email address.
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Kiểm tra xem email có phải là email doanh nghiệp không.
   */
  isBusinessEmail(): boolean {
    const domain = this.getDomain();
    return (
      !domain.includes("gmail.com") &&
      !domain.includes("yahoo.com") &&
      !domain.includes("hotmail.com") &&
      !domain.includes("outlook.com")
    );
  }
}
