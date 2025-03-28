import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard } from '@ecoma/common-utils';

interface IOrganizationIdProps {
  value: string;
}

/**
 * Value Object đại diện cho định danh duy nhất của một tổ chức
 */
export class OrganizationId extends AbstractValueObject<IOrganizationIdProps> {
  constructor(id: string) {
    super({ value: id });
    Guard.againstNullOrUndefined(id, 'organizationId');
    Guard.againstEmptyString(id, 'organizationId');
  }

  get value(): string {
    return this.props.value;
  }

  public override equals(id?: OrganizationId): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    return this.props.value === id.props.value;
  }
}
