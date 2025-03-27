import { AbstractValueObject } from "@ecoma/common-domain";

import { WeakPasswordError } from "../errors";

interface IPasswordProps {
  value: string;
}

/**
 * Represents a password.
 */
export class Password extends AbstractValueObject<IPasswordProps> {
  constructor(value: string) {
    if (!Password.isStrongEnough(value)) {
      throw new WeakPasswordError();
    }
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }

  /**
   * Gets the strength of the password.
   */
  getStrength(): "weak" | "medium" | "strong" {
    const length = this.props.value.length;
    const uniqueChars = new Set(this.props.value).size;
    const hasUpperCase = /[A-Z]/.test(this.props.value);
    const hasLowerCase = /[a-z]/.test(this.props.value);
    const hasNumbers = /\d/.test(this.props.value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(this.props.value);

    const score =
      (length >= 12 ? 2 : length >= 8 ? 1 : 0) +
      (uniqueChars >= 8 ? 2 : uniqueChars >= 5 ? 1 : 0) +
      (hasUpperCase ? 1 : 0) +
      (hasLowerCase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecialChar ? 1 : 0);

    if (score >= 6) return "strong";
    if (score >= 4) return "medium";
    return "weak";
  }

  /**
   * Checks if the password contains personal information.
   */
  containsPersonalInfo(
    firstName: string,
    lastName: string,
    email: string
  ): boolean {
    const lowercasePassword = this.props.value.toLowerCase();
    const lowercaseFirstName = firstName.toLowerCase();
    const lowercaseLastName = lastName.toLowerCase();
    const lowercaseEmail = email.toLowerCase();

    return (
      lowercasePassword.includes(lowercaseFirstName) ||
      lowercasePassword.includes(lowercaseLastName) ||
      lowercasePassword.includes(lowercaseEmail)
    );
  }

  /**
   * Checks if a password is strong enough.
   */
  private static isStrongEnough(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }
}
