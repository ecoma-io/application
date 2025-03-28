import {
  AbstractStartedContainer,
  GenericContainer,
  StartedTestContainer,
  Wait,
} from "testcontainers";

const SERVICE_PORT = 3000;

export class EmailNotificationWorkerContainer extends GenericContainer {
  private env: Record<string, string> = {
    PORT: SERVICE_PORT.toString(),
  };

  constructor(image = "ghcr.io/ecoma-io/email-notification-worker") {
    super(image);
    this.withExposedPorts(SERVICE_PORT)
      .withWaitStrategy(
        Wait.forHttp("/health", SERVICE_PORT, { abortOnContainerExit: true })
          .forStatusCode(200)
      )
      .withStartupTimeout(120_000);
  }

  public withRabbitMQUri(uri: string): this {
    this.env["RABBITMQ_SERVERS"] = uri;
    return this;
  }

  public withSMTPUri(uri: string): this {
    this.env["SMTP_SERVER"] = uri;
    return this;
  }

  public override async start(): Promise<StartedEmailNotificationWorkerContainer> {
    this.withEnvironment(this.env);
    return new StartedEmailNotificationWorkerContainer(await super.start());
  }
}

export class StartedEmailNotificationWorkerContainer extends AbstractStartedContainer {
  private readonly apiPort: number;

  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer);
    this.apiPort = startedTestContainer.getMappedPort(SERVICE_PORT);
  }

  public getApiPort(): number {
    return this.apiPort;
  }

  public getBaseUrl(): string {
    return `http://${this.getHost()}:${this.apiPort}`;
  }
}
