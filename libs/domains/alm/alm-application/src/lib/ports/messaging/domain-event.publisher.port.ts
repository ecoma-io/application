import { AbstractDomainEvent } from '@ecoma/common-domain';

/**
 * Port định nghĩa các thao tác xuất bản domain event
 */
export interface IDomainEventPublisherPort {
  /**
   * Xuất bản một domain event
   * @param event Domain event cần xuất bản
   */
  publish<T extends AbstractDomainEvent>(event: T): Promise<void>;

  /**
   * Xuất bản nhiều domain event
   * @param events Danh sách domain event cần xuất bản
   */
  publishAll<T extends AbstractDomainEvent>(events: T[]): Promise<void>;
}
