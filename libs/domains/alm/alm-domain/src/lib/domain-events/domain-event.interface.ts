/**
 * @fileoverview Interface định nghĩa domain event
 * @since 1.0.0
 */

/**
 * Metadata của domain event
 */
export interface IDomainEventMetadata {
  /** Thời điểm xảy ra event */
  timestamp: Date;

  /** Phiên bản của event */
  version: string;
}

/**
 * Interface định nghĩa domain event
 */
export interface IDomainEvent {
  /** Metadata của event */
  metadata: IDomainEventMetadata;
}
