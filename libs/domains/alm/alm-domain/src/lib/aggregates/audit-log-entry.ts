/**
 * @fileoverview Định nghĩa aggregate root cho AuditLogEntry
 * @since 1.0.0
 */

import { AbstractAggregate } from "@ecoma/common-domain";
import { AuditContext, AuditLogEntryId, Initiator } from "../value-objects";

/**
 * Interface định nghĩa các thuộc tính để khởi tạo AuditLogEntry
 */
export interface IAuditLogEntryProps {
  id: AuditLogEntryId;
  eventId?: string | null;
  timestamp: Date;
  initiator: Initiator;
  boundedContext: string;
  actionType: string;
  category?: string | null;
  severity?: string | null;
  entityId?: string | null;
  entityType?: string | null;
  tenantId?: string | null;
  contextData: AuditContext;
  status: string;
  failureReason?: string | null;
  createdAt?: Date;
}

/**
 * Aggregate root cho AuditLogEntry
 * @class
 * @extends {AbstractAggregate<AuditLogEntryId>}
 */
export class AuditLogEntry extends AbstractAggregate<AuditLogEntryId> {
  public readonly eventId: string | null;
  public readonly timestamp: Date;
  public readonly initiator: Initiator;
  public readonly boundedContext: string;
  public readonly actionType: string;
  public readonly category: string | null;
  public readonly severity: string | null;
  public readonly entityId: string | null;
  public readonly entityType: string | null;
  public readonly tenantId: string | null;
  public readonly contextData: AuditContext;
  public readonly status: string;
  public readonly failureReason: string | null;
  public readonly createdAt: Date;

  constructor(props: IAuditLogEntryProps) {
    super(props.id);

    // Validate required fields
    if (!props.boundedContext) {
      throw new Error('boundedContext is required');
    }
    if (!props.actionType) {
      throw new Error('actionType is required');
    }
    if (!props.status) {
      throw new Error('status is required');
    }
    if (props.status === 'Failure' && !props.failureReason) {
      throw new Error('failureReason is required when status is Failure');
    }

    this.eventId = props.eventId || null;
    this.timestamp = props.timestamp;
    this.initiator = props.initiator;
    this.boundedContext = props.boundedContext;
    this.actionType = props.actionType;
    this.category = props.category || null;
    this.severity = props.severity || null;
    this.entityId = props.entityId || null;
    this.entityType = props.entityType || null;
    this.tenantId = props.tenantId || null;
    this.contextData = props.contextData;
    this.status = props.status;
    this.failureReason = props.failureReason || null;
    this.createdAt = props.createdAt || new Date();
  }

  /**
   * Lấy ID của audit log entry dưới dạng string
   * @returns {string} ID của audit log entry
   * @example
   * const entry = new AuditLogEntry(...);
   * entry.getIdentifier(); // 'abc123'
   * @since 1.0.0
   */
  public getIdentifier(): string {
    return this.id.toString();
  }

  /**
   * Factory method để tạo mới AuditLogEntry
   * @param {IAuditLogEntryProps} props - Các thuộc tính để khởi tạo AuditLogEntry
   * @returns {AuditLogEntry} Instance mới
   * @example
   * AuditLogEntry.create({...})
   * @since 1.0.0
   */
  public static create(props: IAuditLogEntryProps): AuditLogEntry {
    return new AuditLogEntry({
      ...props,
      createdAt: new Date()
    });
  }
}
