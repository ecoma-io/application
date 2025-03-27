import { AbstractValueObject } from "@ecoma/common-domain";

import { InvalidResourceTypeError } from "../errors/billing.error";
import { UsageUnit } from "./usage-quantity.value-object";

/**
 * Resource category in the system.
 */
export enum ResourceCategory {
  COMPUTE = "COMPUTE", // Computing resources
  STORAGE = "STORAGE", // Storage resources
  NETWORK = "NETWORK", // Network resources
  SERVICE = "SERVICE", // Service resources
}

/**
 * Properties for ResourceType value object.
 */
export interface IResourceTypeProps {
  code: string;
  name: string;
  category: ResourceCategory;
  unit: UsageUnit;
  description: string;
}

/**
 * Represents a resource type in the system.
 * @extends {AbstractValueObject<IResourceTypeProps>}
 */
export class ResourceType extends AbstractValueObject<IResourceTypeProps> {
  /**
   * Creates a new ResourceType instance.
   * @param props - The resource type properties
   * @throws {InvalidResourceTypeError} If any required field is missing or invalid
   */
  constructor(props: IResourceTypeProps) {
    super(props);
    this.validate();
  }

  /**
   * Validates the resource type properties.
   * @throws {InvalidResourceTypeError} If any required field is missing or invalid
   */
  private validate(): void {
    if (!this.props.code || this.props.code.trim().length === 0) {
      throw new InvalidResourceTypeError(this.props.code, "Code is required");
    }

    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new InvalidResourceTypeError(this.props.code, "Name is required");
    }

    if (!Object.values(ResourceCategory).includes(this.props.category)) {
      throw new InvalidResourceTypeError(this.props.code, "Invalid category");
    }

    if (!Object.values(UsageUnit).includes(this.props.unit)) {
      throw new InvalidResourceTypeError(this.props.code, "Invalid unit");
    }
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get category(): ResourceCategory {
    return this.props.category;
  }

  get unit(): UsageUnit {
    return this.props.unit;
  }

  get description(): string {
    return this.props.description;
  }

  /**
   * Checks if this is a compute resource.
   * @returns True if this is a compute resource
   */
  isCompute(): boolean {
    return this.props.category === ResourceCategory.COMPUTE;
  }

  /**
   * Checks if this is a storage resource.
   * @returns True if this is a storage resource
   */
  isStorage(): boolean {
    return this.props.category === ResourceCategory.STORAGE;
  }

  /**
   * Checks if this is a network resource.
   * @returns True if this is a network resource
   */
  isNetwork(): boolean {
    return this.props.category === ResourceCategory.NETWORK;
  }

  /**
   * Checks if this is a service resource.
   * @returns True if this is a service resource
   */
  isService(): boolean {
    return this.props.category === ResourceCategory.SERVICE;
  }

  /**
   * Converts the resource type to string.
   */
  override toString(): string {
    return `${this.props.name} (${this.props.code})`;
  }
}
