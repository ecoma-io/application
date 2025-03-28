/**
 * @fileoverview Publisher cho commands
 * @since 1.0.0
 */

import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

/**
 * Publisher cho commands
 */
@Injectable()
export class CommandPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  /**
   * Publish một command
   * @param {string} queue - Queue để gửi command
   * @param {unknown} command - Command cần gửi
   * @returns {Promise<void>}
   */
  async publish(queue: string, command: unknown): Promise<void> {
    await this.amqpConnection.publish(
      'commands',
      queue,
      command
    );
  }
}
