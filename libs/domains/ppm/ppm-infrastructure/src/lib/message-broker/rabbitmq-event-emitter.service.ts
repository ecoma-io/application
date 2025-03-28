import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { IEventEmitter } from '@ecoma/ppm-application';

/**
 * RabbitMQ implementation của IEventEmitter
 */
@Injectable()
export class RabbitMQEventEmitter implements IEventEmitter {
  private readonly logger = new Logger(RabbitMQEventEmitter.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  /**
   * Phát một domain event
   * @param event - Domain event cần phát
   * @returns Promise<void>
   */
  async emit(event: any): Promise<void> {
    try {
      const eventType = this._getEventType(event);
      const routingKey = `ppm.events.${eventType}`;
      const exchange = 'ppm.events';

      await this.amqpConnection.publish(exchange, routingKey, event);
      this.logger.debug(`Event ${eventType} đã được phát`);
    } catch (error) {
      this.logger.error(`Lỗi khi phát event: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Phát nhiều domain events cùng lúc
   * @param events - Danh sách domain events cần phát
   * @returns Promise<void>
   */
  async emitMany(events: any[]): Promise<void> {
    if (!events || events.length === 0) {
      return;
    }

    try {
      const promises = events.map((event) => this.emit(event));
      await Promise.all(promises);
    } catch (error) {
      this.logger.error(`Lỗi khi phát nhiều events: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Lấy loại của event từ đối tượng event
   * @param event - Domain event cần xác định loại
   * @returns string - Loại của event
   * @private
   */
  private _getEventType(event: any): string {
    // Tìm tên class từ constructor
    const constructorName = event.constructor.name;

    // Loại bỏ phần "Event" ở cuối nếu có và chuyển thành snake_case
    let eventType = constructorName.replace(/Event$/, '');
    eventType = this._camelToSnakeCase(eventType);

    return eventType;
  }

  /**
   * Chuyển đổi camelCase sang snake_case
   * @param str - Chuỗi cần chuyển đổi
   * @returns string - Chuỗi dạng snake_case
   * @private
   */
  private _camelToSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }
}
