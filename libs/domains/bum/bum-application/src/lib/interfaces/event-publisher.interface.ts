import { DomainEvent } from '@ecoma/common-domain';

/**
 * Interface cho phép publish các domain events ra bên ngoài
 */
export interface IEventPublisherPort {
  /**
   * Publish domain event ra bên ngoài
   * @param event Domain event cần publish
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Publish nhiều domain events ra bên ngoài
   * @param events Danh sách các domain events cần publish
   */
  publishAll(events: DomainEvent[]): Promise<void>;
}
