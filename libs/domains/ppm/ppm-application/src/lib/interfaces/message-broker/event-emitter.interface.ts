/**
 * Interface cho Event Emitter để phát các domain events của PPM
 */
export interface IEventEmitter {
  /**
   * Phát một domain event
   * @param event - Domain event cần phát
   * @returns Promise<void>
   */
  emit(event: any): Promise<void>;

  /**
   * Phát nhiều domain events cùng lúc
   * @param events - Danh sách domain events cần phát
   * @returns Promise<void>
   */
  emitMany(events: any[]): Promise<void>;
}
