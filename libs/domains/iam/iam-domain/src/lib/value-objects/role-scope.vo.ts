import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

export enum RoleScopeValues {
  INTERNAL = 'Internal', // For Ecoma platform administrators/staff
  ORGANIZATION = 'Organization', // For organization-specific roles
  // SYSTEM = 'System', // If there are roles managed purely by the system
}

interface IRoleScopeProps {
  value: RoleScopeValues;
}

export class RoleScope extends AbstractValueObject<IRoleScopeProps> {
  get value(): RoleScopeValues { return this.props.value; }

  public static readonly values = RoleScopeValues;

  private constructor(props: IRoleScopeProps) { super(props); }

  public static create(value: RoleScopeValues): RoleScope {
    Guard.againstNullOrUndefined(value, 'value');
    return new RoleScope({ value });
  }

  public static createInternal(): RoleScope {
    return this.create(RoleScopeValues.INTERNAL);
  }

  public static createOrganization(): RoleScope {
    return this.create(RoleScopeValues.ORGANIZATION);
  }

  public isInternal(): boolean {
    return this.props.value === RoleScopeValues.INTERNAL;
  }

  public isOrganization(): boolean {
    return this.props.value === RoleScopeValues.ORGANIZATION;
  }
}
