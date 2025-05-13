import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

export enum OrganizationStatusValues {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SUSPENDED = 'Suspended',
}

interface IOrganizationStatusProps {
  value: OrganizationStatusValues;
}

export class OrganizationStatus extends AbstractValueObject<IOrganizationStatusProps> {
  get value(): OrganizationStatusValues { return this.props.value; }

  public static readonly values = OrganizationStatusValues;

  private constructor(props: IOrganizationStatusProps) { super(props); }

  public static create(value: OrganizationStatusValues): OrganizationStatus {
    Guard.againstNullOrUndefined(value, 'value');
    return new OrganizationStatus({ value });
  }

  public static createActive(): OrganizationStatus {
    return this.create(OrganizationStatusValues.ACTIVE);
  }

  public static createInactive(): OrganizationStatus {
    return this.create(OrganizationStatusValues.INACTIVE);
  }

  public static createSuspended(): OrganizationStatus {
    return this.create(OrganizationStatusValues.SUSPENDED);
  }

  public is(status: OrganizationStatusValues): boolean {
    return this.props.value === status;
  }
}
