import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

// Example: "module:action:scope" or "module:action"
// e.g., "product:create:organization", "user:read:internal"
interface IPermissionProps {
  value: string;
}

export class Permission extends AbstractValueObject<IPermissionProps> {
  get value(): string { return this.props.value; }

  private constructor(props: IPermissionProps) { super(props); }

  public static create(permissionString: string): Permission {
    Guard.againstNullOrUndefined(permissionString, 'permissionString');
    Guard.againstEmptyString(permissionString, 'permissionString');

    // Validate format
    const parts = permissionString.split(':');
    if (parts.length < 2 || parts.length > 3) {
      throw new Error('Permission must be in format "module:action[:scope]"');
    }

    return new Permission({ value: permissionString });
  }

  public getModule(): string {
    return this.props.value.split(':')[0];
  }

  public getAction(): string {
    return this.props.value.split(':')[1];
  }

  public getScope(): string | undefined {
    const parts = this.props.value.split(':');
    return parts.length > 2 ? parts[2] : undefined;
  }
}
