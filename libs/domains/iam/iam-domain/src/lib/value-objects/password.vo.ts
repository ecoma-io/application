import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

interface IPasswordProps {
  value: string;
}

export class Password extends AbstractValueObject<IPasswordProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: IPasswordProps) {
    super(props);
  }

  public static create(password: string): Password {
    Guard.againstNullOrUndefined(password, 'password');
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Check for at least one uppercase, one lowercase, one number and one special character
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character');
    }
    
    return new Password({ value: password });
  }
} 