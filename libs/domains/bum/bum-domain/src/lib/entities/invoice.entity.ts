import { AbstractAggregate, SnowflakeId } from "@ecoma/common-domain";

import {
  InvoiceCancelledEvent,
  InvoiceItemAddedEvent,
  InvoiceItemRemovedEvent,
  InvoiceMarkedAsPaidEvent,
  InvoiceMarkedAsPendingEvent,
  InvoiceMarkedAsRefundedEvent,
  InvoiceMetadataUpdatedEvent,
} from "../events/invoice.event";
import { InvoiceItem } from "../value-objects/invoice-item.value-object";
import { Money } from "../value-objects/money.value-object";

/**
 * Trạng thái của hóa đơn.
 */
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

/**
 * Props interface for Invoice aggregate
 */
export interface IInvoiceProps {
  id: SnowflakeId;
  organizationId: string;
  subscriptionId: string;
  status: InvoiceStatus;
  number: string;
  issuedAt: Date;
  dueAt: Date;
  paidAt: Date | null;
  cancelledAt: Date | null;
  refundedAt: Date | null;
  subtotal: Money;
  tax: Money;
  total: Money;
  currency: string;
  items: InvoiceItem[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents an invoice in the system.
 * @extends {AbstractAggregate}
 */
export class Invoice extends AbstractAggregate<SnowflakeId, IInvoiceProps> {
  constructor(props: IInvoiceProps) {
    super(props);
  }

  // Getters
  get organizationId(): string {
    return this.props.organizationId;
  }

  get subscriptionId(): string {
    return this.props.subscriptionId;
  }

  get status(): InvoiceStatus {
    return this.props.status;
  }

  get number(): string {
    return this.props.number;
  }

  get issuedAt(): Date {
    return this.props.issuedAt;
  }

  get dueAt(): Date {
    return this.props.dueAt;
  }

  get paidAt(): Date | null {
    return this.props.paidAt;
  }

  get cancelledAt(): Date | null {
    return this.props.cancelledAt;
  }

  get refundedAt(): Date | null {
    return this.props.refundedAt;
  }

  get subtotal(): Money {
    return this.props.subtotal;
  }

  get tax(): Money {
    return this.props.tax;
  }

  get total(): Money {
    return this.props.total;
  }

  get currency(): string {
    return this.props.currency;
  }

  get items(): InvoiceItem[] {
    return [...this.props.items];
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
   * Add an item to the invoice
   */
  public addItem(item: InvoiceItem): void {
    this.props.items.push(item);
    this.recalculateTotal();
    this.props.updatedAt = new Date();
    this.addDomainEvent(new InvoiceItemAddedEvent(this.id.toString(), item));
  }

  /**
   * Remove an item from the invoice
   */
  public removeItem(itemId: string): void {
    const index = this.props.items.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      const removedItem = this.props.items.splice(index, 1)[0];
      this.recalculateTotal();
      this.props.updatedAt = new Date();
      this.addDomainEvent(
        new InvoiceItemRemovedEvent(this.id.toString(), removedItem)
      );
    }
  }

  /**
   * Mark invoice as pending
   */
  public markAsPending(): void {
    this.props.status = InvoiceStatus.PENDING;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new InvoiceMarkedAsPendingEvent(this.id.toString()));
  }

  /**
   * Mark invoice as paid
   */
  public markAsPaid(): void {
    this.props.status = InvoiceStatus.PAID;
    this.props.paidAt = new Date();
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new InvoiceMarkedAsPaidEvent(this.id.toString(), this.props.paidAt)
    );
  }

  /**
   * Cancel the invoice
   */
  public cancel(): void {
    this.props.status = InvoiceStatus.CANCELLED;
    this.props.cancelledAt = new Date();
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new InvoiceCancelledEvent(this.id.toString(), this.props.cancelledAt)
    );
  }

  /**
   * Mark invoice as refunded
   */
  public markAsRefunded(): void {
    this.props.status = InvoiceStatus.REFUNDED;
    this.props.refundedAt = new Date();
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new InvoiceMarkedAsRefundedEvent(
        this.id.toString(),
        this.props.refundedAt
      )
    );
  }

  /**
   * Update invoice metadata
   */
  public updateMetadata(metadata: Record<string, unknown>): void {
    this.props.metadata = { ...metadata };
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new InvoiceMetadataUpdatedEvent(this.id.toString(), this.props.metadata)
    );
  }

  /**
   * Recalculate invoice total
   */
  private recalculateTotal(): void {
    this.props.subtotal = this.props.items.reduce(
      (sum, item) => sum.add(item.amount),
      new Money({ amount: 0, currency: this.props.currency })
    );
    this.props.total = this.props.subtotal.add(this.props.tax);
  }
}
