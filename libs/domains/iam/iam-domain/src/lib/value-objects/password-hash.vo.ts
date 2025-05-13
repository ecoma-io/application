import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

interface IPasswordHashProps {
  value: string;
}

export class PasswordHash extends AbstractValueObject<IPasswordHashProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: IPasswordHashProps) {
    super(props);
  }

  public static create(hash: string): PasswordHash {
    Guard.againstNullOrEmpty(hash, 'hash');
    return new PasswordHash({ value: hash });
  }

  public static fromValue(hash: string): PasswordHash {
    return this.create(hash);
  }
}
