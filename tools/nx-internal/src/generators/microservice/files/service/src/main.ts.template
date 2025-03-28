import { NestjsLogger } from "@ecoma/nestjs-logging";
import { NatsOptions, Transport } from "@nestjs/microservices";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";

async function bootstrap() {
  const logger = new NestjsLogger();
  const app = await NestFactory.create(AppModule, { logger });

  app.connectMicroservice<NatsOptions>({
    transport: Transport.NATS,
    options: {
      servers: process.env.NATS_SERVERS.split(","),
      gracefulShutdown: true,
      waitOnFirstConnect: true,
      gracePeriod: +process.env.GRACE_PERIOD | 10000,
    },
  });

  await app.startAllMicroservices();
  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0");
  logger.log(`Http listining on ${port}`, "Bootstrap");
}

bootstrap();
