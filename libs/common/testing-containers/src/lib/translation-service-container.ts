import {
  AbstractStartedContainer,
  GenericContainer,
  StartedTestContainer,
  Wait,
} from "testcontainers";

const SERVICE_PORT = 3000;

export class TranslationServiceContainer extends GenericContainer {
  private env: Record<string, string> = {
    PORT: SERVICE_PORT.toString(),
  };

  constructor(image = "ghcr.io/ecoma-io/translation-service") {
    super(image);
    this.withExposedPorts(SERVICE_PORT)
      .withWaitStrategy(
        Wait.forHttp("/health", SERVICE_PORT, { abortOnContainerExit: true })
          .forStatusCode(200)
      )
      .withStartupTimeout(120_000);
  }

  public withMongoUri(uri: string): this {
    this.env["MONGODB_URI"] = uri;
    return this;
  }

  public withNatsUri(uri: string): this {
    this.env["NATS_SERVERS"] = uri;
    return this;
  }

  public override async start(): Promise<StartedTranslationServiceContainer> {
    this.withEnvironment(this.env);
    return new StartedTranslationServiceContainer(await super.start());
  }
}

export class StartedTranslationServiceContainer extends AbstractStartedContainer {
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
