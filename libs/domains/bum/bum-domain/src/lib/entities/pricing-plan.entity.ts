import { AbstractAggregate, SnowflakeId } from "@ecoma/common-domain";

import {
  PricingPlanActivatedEvent,
  PricingPlanDeactivatedEvent,
  PricingPlanUpdatedEvent,
} from "../events/pricing-plan.event";
import { Money } from "../value-objects/money.value-object";

/**
 * Trạng thái của gói giá.
 */
export enum PricingPlanStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

/**
 * Props interface for PricingPlan aggregate
 */
export interface IPricingPlanProps {
  id: SnowflakeId;
  name: string;
  description: string;
  status: PricingPlanStatus;
  price: Money;
  billingPeriod: number;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a pricing plan in the system.
 * @extends {AbstractAggregate}
 */
export class PricingPlan extends AbstractAggregate<
  SnowflakeId,
  IPricingPlanProps
> {
  constructor(props: IPricingPlanProps) {
    super(props);
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get status(): PricingPlanStatus {
    return this.props.status;
  }

  get price(): Money {
    return this.props.price;
  }

  get billingPeriod(): number {
    return this.props.billingPeriod;
  }

  get metadata(): Record<string, unknown> {
    return { ...this.props.metadata };
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Update the pricing plan
   */
  public update(
    name: string,
    description: string,
    metadata: Record<string, unknown>
  ): void {
    this.props.name = name;
    this.props.description = description;
    this.props.metadata = { ...metadata };
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new PricingPlanUpdatedEvent(
        this.id.toString(),
        name,
        description,
        metadata
      )
    );
  }

  /**
   * Deactivate the pricing plan
   */
  public deactivate(): void {
    if (this.props.status === PricingPlanStatus.INACTIVE) {
      return;
    }

    this.props.status = PricingPlanStatus.INACTIVE;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new PricingPlanDeactivatedEvent(this.id.toString()));
  }

  /**
   * Activate the pricing plan
   */
  public activate(): void {
    if (this.props.status === PricingPlanStatus.ACTIVE) {
      return;
    }

    this.props.status = PricingPlanStatus.ACTIVE;
    this.props.updatedAt = new Date();

    this.addDomainEvent(new PricingPlanActivatedEvent(this.id.toString()));
  }
}
