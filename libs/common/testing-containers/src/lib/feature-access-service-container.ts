import {
  AbstractStartedContainer,
  GenericContainer,
  StartedTestContainer,
  Wait,
} from "testcontainers";

const SERVICE_PORT = 3000;

export class FeatureAccessServiceContainer extends GenericContainer {
  private env: Record<string, string> = {
    PORT: SERVICE_PORT.toString(),
  };

  constructor(image = "ghcr.io/ecoma-io/feature-access-service") {
    super(image);
    this.withExposedPorts(SERVICE_PORT)
      .withWaitStrategy(
        Wait.forHttp("/health", SERVICE_PORT, {
          abortOnContainerExit: true,
        }).forStatusCode(200)
      )
      .withStartupTimeout(120_000);
  }

  public withEnv(name: string, value: string): this {
    this.env[name] = value;
    return this;
  }

  public override async start(): Promise<StartedFeatureAccessServiceContainer> {
    this.withEnvironment(this.env);
    return new StartedFeatureAccessServiceContainer(await super.start());
  }
}

export class StartedFeatureAccessServiceContainer extends AbstractStartedContainer {
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
