import { Entity } from './entity.interface';

/**
 * Interface cơ bản cho tất cả các Aggregate Root trong bounded context DAM.
 * Aggregate Root là một Entity đặc biệt, là root của một aggregate.
 */
export interface AggregateRoot extends Entity {
  /**
   * Lấy danh sách các domain events chưa được xử lý.
   */
  getUncommittedEvents(): any[];

  /**
   * Đánh dấu tất cả các events là đã được xử lý.
   */
  clearEvents(): void;
}
