import { AbstractValueObject } from "@ecoma/common-domain";

import { Money } from "./money.value-object";

export interface IInvoiceItemProps {
  id: string;
  description: string;
  quantity: number;
  unitPrice: Money;
  amount: Money;
  metadata: Record<string, unknown>;
}

/**
 * Represents an invoice item in the system.
 */
export class InvoiceItem extends AbstractValueObject<IInvoiceItemProps> {
  constructor(props: IInvoiceItemProps) {
    super(props);
  }

  get id(): string {
    return this.props.id;
  }

  get description(): string {
    return this.props.description;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get unitPrice(): Money {
    return this.props.unitPrice;
  }

  get amount(): Money {
    return this.props.amount;
  }

  get metadata(): Record<string, unknown> {
    return { ...this.props.metadata };
  }

  override equals(other: InvoiceItem): boolean {
    return this.props.id === other.id;
  }

  override toString(): string {
    return `${this.props.description} (${this.props.quantity} x ${this.props.unitPrice})`;
  }
}
