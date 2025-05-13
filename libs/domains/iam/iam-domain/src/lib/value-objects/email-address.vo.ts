import { AbstractValueObject } from '@ecoma/common-domain'; // Adjust path
import { Guard, isEmail } from '@ecoma/common-utils'; // Adjust path

interface IEmailAddressProps {
  value: string;
}

export class EmailAddress extends AbstractValueObject<IEmailAddressProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: IEmailAddressProps) {
    super(props);
  }

  public static create(email: string): EmailAddress {
    Guard.againstNullOrEmpty(email, 'email');
    if (!isEmail(email)) {
      throw new Error('Invalid email format'); // Or specific DomainError
    }
    return new EmailAddress({ value: email.toLowerCase() });
  }
}
