import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidOrganizationSlugError } from "../errors";

interface IOrganizationSlugProps {
  value: string;
}

/**
 * Represents an organization slug.
 */
export class OrganizationSlug extends AbstractValueObject<IOrganizationSlugProps> {
  constructor(value: string) {
    if (!OrganizationSlug.isValidSlug(value)) {
      throw new InvalidOrganizationSlugError(value);
    }
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }

  /**
   * Checks if the slug is a default one.
   */
  isDefault(): boolean {
    return /^org-[a-f0-9]{8}$/.test(this.props.value);
  }

  /**
   * Validates a slug.
   */
  private static isValidSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  }

  /**
   * Tạo slug từ tên tổ chức.
   */
  static fromName(name: string): OrganizationSlug {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    return new OrganizationSlug(slug);
  }

  /**
   * Tạo slug mặc định.
   */
  static createDefault(id: string): OrganizationSlug {
    const shortId = id.substring(0, 8);
    return new OrganizationSlug(`org-${shortId}`);
  }
}
