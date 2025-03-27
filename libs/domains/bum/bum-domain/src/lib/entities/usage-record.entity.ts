import { AbstractAggregate, SnowflakeId } from "@ecoma/common-domain";

import {
  UsageRecordMetadataUpdatedEvent,
  UsageRecordTimestampUpdatedEvent,
  UsageRecordUpdatedEvent,
} from "../events/usage-record.event";

/**
 * Props interface for UsageRecord aggregate
 */
export interface IUsageRecordProps {
  id: SnowflakeId;
  organizationId: string;
  subscriptionId: string;
  metricId: string;
  value: number;
  timestamp: Date;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a usage record in the system.
 * @extends {AbstractAggregate}
 */
export class UsageRecord extends AbstractAggregate<
  SnowflakeId,
  IUsageRecordProps
> {
  constructor(props: IUsageRecordProps) {
    super(props);
  }

  // Getters
  get organizationId(): string {
    return this.props.organizationId;
  }

  get subscriptionId(): string {
    return this.props.subscriptionId;
  }

  get metricId(): string {
    return this.props.metricId;
  }

  get value(): number {
    return this.props.value;
  }

  get timestamp(): Date {
    return this.props.timestamp;
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
   * Update the usage record value
   */
  public updateValue(value: number): void {
    this.props.value = value;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UsageRecordUpdatedEvent(
        this.id.toString(),
        this.props.organizationId,
        this.props.subscriptionId,
        this.props.metricId,
        value
      )
    );
  }

  /**
   * Update usage record metadata
   */
  public updateMetadata(metadata: Record<string, unknown>): void {
    this.props.metadata = { ...metadata };
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UsageRecordMetadataUpdatedEvent(
        this.id.toString(),
        this.props.organizationId,
        this.props.subscriptionId,
        this.props.metricId,
        metadata
      )
    );
  }

  /**
   * Update the usage record timestamp
   */
  public updateTimestamp(timestamp: Date): void {
    this.props.timestamp = timestamp;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new UsageRecordTimestampUpdatedEvent(
        this.id.toString(),
        this.props.organizationId,
        this.props.subscriptionId,
        this.props.metricId,
        timestamp
      )
    );
  }
}
