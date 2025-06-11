import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RabbitmqEnvironmentVariables {
  @IsString()
  @Matches(/^amqp(s)?:\/\//, {
    message: 'RABBITMQ_URI must be a valid RabbitMQ connection string starting with amqp:// or amqps://',
  })
  @IsNotEmpty()
  RABBITMQ_URI: string | undefined;
}
