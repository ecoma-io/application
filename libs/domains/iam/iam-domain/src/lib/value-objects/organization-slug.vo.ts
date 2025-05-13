import { AbstractValueObject } from '@ecoma/common-domain';
import { Guard, isKebabCase } from '@ecoma/common-utils';

interface IOrganizationSlugProps {
  value: string;
}

export class OrganizationSlug extends AbstractValueObject<IOrganizationSlugProps> {
  get value(): string { return this.props.value; }
  private constructor(props: IOrganizationSlugProps) { super(props); }
  public static create(slug: string): OrganizationSlug {
    Guard.againstNullOrUndefined(slug, 'slug');
    Guard.againstEmptyString(slug, 'slug');
    // Add specific slug format validation if needed (e.g., regex for allowed characters)
    if (!isKebabCase(slug)) { // Assuming a common utility
        throw new Error('Organization slug must be in kebab-case.'); // Consider DomainError
    }
    return new OrganizationSlug({ value: slug.toLowerCase() });
  }
}
