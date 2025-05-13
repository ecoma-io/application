import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

interface IUserProfileProps {
  firstName: string;
  lastName: string;
  locale: string;
}

export class UserProfile extends AbstractValueObject<IUserProfileProps> {
  get firstName(): string { return this.props.firstName; }
  get lastName(): string { return this.props.lastName; }
  get locale(): string { return this.props.locale; }

  private constructor(props: IUserProfileProps) {
    super(props);
  }

  public static create(firstName: string, lastName: string, locale: string): UserProfile {
    Guard.againstNullOrEmpty(firstName, 'firstName');
    Guard.againstNullOrEmpty(lastName, 'lastName');
    Guard.againstNullOrEmpty(locale, 'locale');

    return new UserProfile({
      firstName,
      lastName,
      locale
    });
  }
} 