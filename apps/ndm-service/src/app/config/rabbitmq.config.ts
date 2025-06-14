import { RabbitmqEnvironmentVariables, registerConfig } from "@ecoma/nestjs";
import { RabbitMQConfig } from "@golevelup/nestjs-rabbitmq";


export class RabbitmqConfig implements RabbitMQConfig {
  uri: string | string[];
}

export const rabbitConfig = registerConfig<RabbitmqEnvironmentVariables, RabbitmqConfig>('rabbitmq', RabbitmqEnvironmentVariables, undefined, (enviroments) => {
  return {
    uri: enviroments.RABBITMQ_URI,
  }
});