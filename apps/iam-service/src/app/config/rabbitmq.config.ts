import { RabbitmqEnvironmentVariables, registerConfig } from "@ecoma/nestjs-config";
import { RabbitMQConfig } from "@golevelup/nestjs-rabbitmq";


export class RabbitmqConfig implements RabbitMQConfig {
  uri: string | string[];
}

export const mongodbConfig = registerConfig<RabbitmqEnvironmentVariables, RabbitmqConfig>('rabbitmq', RabbitmqEnvironmentVariables, undefined, (enviroments) => {
  return {
    uri: enviroments.RABBITMQ_URI,
  }
});