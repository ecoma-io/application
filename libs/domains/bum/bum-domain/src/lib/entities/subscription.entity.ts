import { AbstractAggregate, SnowflakeId } from "@ecoma/common-domain";

import {
  SubscriptionActivatedEvent,
  SubscriptionCancelledEvent,
  SubscriptionExpiredEvent,
  SubscriptionPlanChangedEvent,
  SubscriptionRenewedEvent,
  SubscriptionSuspendedEvent,
} from "../events/subscription.event";

/**
 * Subscription status in the system.
 */
export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  TRIAL = "TRIAL",
}

interface ISubscriptionProps {
  id: SnowflakeId;
  organizationId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  trialEndsAt: Date | null;
  cancelledAt: Date | null;
  suspendedAt: Date | null;
  lastBillingDate: Date | null;
  nextBillingDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a subscription in the system.
 */
export class Subscription extends AbstractAggregate<
  SnowflakeId,
  ISubscriptionProps
> {
  constructor(
    id: SnowflakeId,
    organizationId: string,
    planId: string,
    startDate: Date,
    endDate: Date | null = null,
    trialEndsAt: Date | null = null,
    status = SubscriptionStatus.ACTIVE,
    createdAt = new Date(),
    updatedAt = new Date()
  ) {
    super({
      id,
      organizationId,
      planId,
      status,
      startDate,
      endDate,
      trialEndsAt,
      cancelledAt: null,
      suspendedAt: null,
      lastBillingDate: null,
      nextBillingDate: null,
      createdAt,
      updatedAt,
    });
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get planId(): string {
    return this.props.planId;
  }

  get status(): SubscriptionStatus {
    return this.props.status;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date | null {
    return this.props.endDate;
  }

  get trialEndsAt(): Date | null {
    return this.props.trialEndsAt;
  }

  get cancelledAt(): Date | null {
    return this.props.cancelledAt;
  }

  get suspendedAt(): Date | null {
    return this.props.suspendedAt;
  }

  get lastBillingDate(): Date | null {
    return this.props.lastBillingDate;
  }

  get nextBillingDate(): Date | null {
    return this.props.nextBillingDate;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Changes the subscription plan.
   */
  changePlan(planId: string): void {
    this.props.planId = planId;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new SubscriptionPlanChangedEvent(
        this.id.toString(),
        this.props.organizationId,
        planId
      )
    );
  }

  /**
   * Suspends the subscription.
   */
  suspend(reason: string): void {
    if (this.props.status === SubscriptionStatus.SUSPENDED) {
      return;
    }

    this.props.status = SubscriptionStatus.SUSPENDED;
    this.props.suspendedAt = new Date();
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new SubscriptionSuspendedEvent(
        this.id.toString(),
        this.props.organizationId,
        reason
      )
    );
  }

  /**
   * Activates the subscription.
   */
  activate(): void {
    if (this.props.status === SubscriptionStatus.ACTIVE) {
      return;
    }

    this.props.status = SubscriptionStatus.ACTIVE;
    this.props.suspendedAt = null;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new SubscriptionActivatedEvent(
        this.id.toString(),
        this.props.organizationId
      )
    );
  }

  /**
   * Cancels the subscription.
   */
  cancel(reason: string): void {
    if (this.props.status === SubscriptionStatus.CANCELLED) {
      return;
    }

    this.props.status = SubscriptionStatus.CANCELLED;
    this.props.cancelledAt = new Date();
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new SubscriptionCancelledEvent(
        this.id.toString(),
        this.props.organizationId,
        reason
      )
    );
  }

  /**
   * Renews the subscription.
   */
  renew(endDate: Date, nextBillingDate: Date): void {
    this.props.endDate = endDate;
    this.props.lastBillingDate = new Date();
    this.props.nextBillingDate = nextBillingDate;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new SubscriptionRenewedEvent(
        this.id.toString(),
        this.props.organizationId,
        endDate,
        nextBillingDate
      )
    );
  }

  /**
   * Marks the subscription as expired.
   */
  expire(): void {
    if (this.props.status === SubscriptionStatus.EXPIRED) {
      return;
    }

    this.props.status = SubscriptionStatus.EXPIRED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new SubscriptionExpiredEvent(
        this.id.toString(),
        this.props.organizationId
      )
    );
  }

  /**
   * Update next billing date.
   */
  updateNextBillingDate(nextBillingDate: Date): void {
    this.props.nextBillingDate = nextBillingDate;
    this.props.updatedAt = new Date();
  }

  /**
   * Check if subscription is in trial period.
   */
  isInTrialPeriod(): boolean {
    return (
      this.props.trialEndsAt !== null && this.props.trialEndsAt > new Date()
    );
  }

  /**
   * Check if subscription is expired.
   */
  isExpired(): boolean {
    return this.props.endDate !== null && this.props.endDate <= new Date();
  }
}
