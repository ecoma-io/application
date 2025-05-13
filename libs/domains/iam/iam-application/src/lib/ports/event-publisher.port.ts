import { IDomainEvent } from '@ecoma/common-domain'; // Adjust path

export interface IEventBus {
  publish<T extends IDomainEvent<any>>(event: T): Promise<void>;
  // publishAll<T extends IDomainEvent<any>>(events: T[]): Promise<void>; // if needed
}

export const IEventBus = Symbol('IEventBus');

// Alternatively, if focusing only on publishing from application layer:
export interface IEventPublisher {
    publish<T extends IDomainEvent<any>>(event: T): Promise<void>;
}
export const IEventPublisher = Symbol('IEventPublisher');
