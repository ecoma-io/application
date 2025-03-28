/**
 * @fileoverview Publisher cho messages
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

/**
 * Publisher cho messages
 */
@Injectable()
export class MessagePublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  /**
   * Publish một message
   * @param {string} exchange - Exchange để gửi message
   * @param {string} routingKey - Routing key của message
   * @param {unknown} message - Message cần gửi
   * @returns {Promise<void>}
   */
  async publish(exchange: string, routingKey: string, message: unknown): Promise<void> {
    await this.amqpConnection.publish(
      exchange,
      routingKey,
      message
    );
  }
}
