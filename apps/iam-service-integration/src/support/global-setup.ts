import { registerTsProject } from '@nx/js/src/internal';
import { workspaceRoot } from '@nx/devkit';
import * as path from 'path';
registerTsProject(path.join(workspaceRoot, 'tsconfig.base.json'));
import * as fs from 'fs';
import { StartedMongoDBContainer, TestLogger, MongoDBContainer, StartedRabbitMQContainer, RabbitMQContainer } from '@ecoma/testing';
import { StartedTestContainer, GenericContainer, Wait } from 'testcontainers';

declare global {
  var testContainers: {
    mongoContainer: any;
    rabbitmqContainer: any;
    iamServiceContainer: any;
  };
}


async function setupMongoDB(): Promise<StartedMongoDBContainer> {
  TestLogger.log("Starting MongoDB container...");
  const mongoContainer = await new MongoDBContainer().start();
  TestLogger.log(`MongoDB container started at ${mongoContainer.getConnectionString()}`);
  return mongoContainer;
}

async function setupRabbitMQ(): Promise<StartedRabbitMQContainer> {
  TestLogger.log("Starting RabbitMQ container...");
  const rabbitmqContainer = await new RabbitMQContainer().start();
  TestLogger.log(`RabbitMQ container started at amqp://${rabbitmqContainer.getHost()}:${rabbitmqContainer.getMappedPort(5672)}`);
  return rabbitmqContainer;
}

async function setupIAMService(
  mongoContainer: StartedMongoDBContainer,
  rabbitmqContainer: StartedRabbitMQContainer
): Promise<StartedTestContainer> {
  TestLogger.log("Starting IAM Service container...");
  const iamServiceContainer = await new GenericContainer('iam-service')
    .withEnvironment({
      PORT: "3000",
      LOG_LEVEL: "debug",
      LOG_FORMAT: "text",
      MONGODB_URI: mongoContainer.getConnectionString(),
      RABBITMQ_URI: `amqp://${rabbitmqContainer.getHost()}:${rabbitmqContainer.getMappedPort(5672)}`,
    })
    .withExposedPorts(3000)
    .withLogConsumer((stream) => {
      stream.on("data", (line: string) => {
        TestLogger.log(line);
      });
      stream.on("error", (error: Error) => {
        TestLogger.error("Error consuming logs:", error);
      });
    })
    .withWaitStrategy(Wait.forHttp('/health', 3000, { abortOnContainerExit: true }))
    .start();

  TestLogger.log("Started IAM Service container successfully");
  return iamServiceContainer;
}


module.exports = async function () {
  // Setup MongoDB
  const mongoContainer = await setupMongoDB();

  // Setup RabbitMQ
  const rabbitmqContainer = await setupRabbitMQ();

  // Setup IAM Service
  const iamServiceContainer = await setupIAMService(mongoContainer, rabbitmqContainer);

  // Store containers in globalThis for teardown
  globalThis.testContainers = {
    mongoContainer,
    rabbitmqContainer,
    iamServiceContainer
  };

  // Save connection info for tests
  const state = {
    mongoUri: mongoContainer.getConnectionString(),
    rabbitmqHost: rabbitmqContainer.getHost(),
    rabbitmqPort: rabbitmqContainer.getMappedPort(5672),
    rabbitmqAmqpUrl: rabbitmqContainer.getAmqpUrl(),
    iamServiceHost: iamServiceContainer.getHost(),
    iamServicePort: iamServiceContainer.getMappedPort(3000),
  };
  fs.writeFileSync(path.resolve(__dirname, '.global-test-state.json'), JSON.stringify(state));
};
