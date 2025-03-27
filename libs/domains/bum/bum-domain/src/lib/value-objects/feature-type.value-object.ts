import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidFeatureTypeError } from "../errors/billing.error";

/**
 * Feature category in the system.
 */
export enum FeatureCategory {
  CORE = "CORE", // Core features
  ADDON = "ADDON", // Add-on features
  INTEGRATION = "INTEGRATION", // Integration features
  SUPPORT = "SUPPORT", // Support features
}

/**
 * Properties for FeatureType value object.
 */
export interface IFeatureTypeProps {
  code: string;
  name: string;
  category: FeatureCategory;
  description: string;
}

/**
 * Represents a feature type in the system.
 * @extends {AbstractValueObject<IFeatureTypeProps>}
 */
export class FeatureType extends AbstractValueObject<IFeatureTypeProps> {
  /**
   * Creates a new FeatureType instance.
   * @param props - The feature type properties
   * @throws {InvalidFeatureTypeError} If any required field is missing or invalid
   */
  constructor(props: IFeatureTypeProps) {
    super(props);
    this.validate();
  }

  /**
   * Validates the feature type properties.
   * @throws {InvalidFeatureTypeError} If any required field is missing or invalid
   */
  private validate(): void {
    if (!this.props.code || this.props.code.trim().length === 0) {
      throw new InvalidFeatureTypeError(this.props.code, "Code is required");
    }

    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new InvalidFeatureTypeError(this.props.code, "Name is required");
    }

    if (!Object.values(FeatureCategory).includes(this.props.category)) {
      throw new InvalidFeatureTypeError(this.props.code, "Invalid category");
    }
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get category(): FeatureCategory {
    return this.props.category;
  }

  get description(): string {
    return this.props.description;
  }

  /**
   * Checks if this is a core feature.
   * @returns True if this is a core feature
   */
  isCore(): boolean {
    return this.props.category === FeatureCategory.CORE;
  }

  /**
   * Checks if this is an add-on feature.
   * @returns True if this is an add-on feature
   */
  isAddon(): boolean {
    return this.props.category === FeatureCategory.ADDON;
  }

  /**
   * Checks if this is an integration feature.
   * @returns True if this is an integration feature
   */
  isIntegration(): boolean {
    return this.props.category === FeatureCategory.INTEGRATION;
  }

  /**
   * Checks if this is a support feature.
   * @returns True if this is a support feature
   */
  isSupport(): boolean {
    return this.props.category === FeatureCategory.SUPPORT;
  }

  /**
   * Converts the feature type to string.
   */
  override toString(): string {
    return `${this.props.name} (${this.props.code})`;
  }
}
