import {
  AbstractStartedContainer,
  GenericContainer,
  StartedTestContainer,
  Wait,
} from "testcontainers";

const CLIENT_PORT = 4222;
const ROUTING_PORT_FOR_CLUSTERING = 6222;
const HTTP_MANAGEMENT_PORT = 8222;

export class NatsContainer extends GenericContainer {
  private args = new Set<string>();
  private values = new Map<string, string | undefined>();

  constructor(image = "nats:2.8.4-alpine") {
    super(image);

    this.withExposedPorts(
      CLIENT_PORT,
      ROUTING_PORT_FOR_CLUSTERING,
      HTTP_MANAGEMENT_PORT
    )
      .withWaitStrategy(Wait.forLogMessage(/.*Server is ready.*/))
      .withStartupTimeout(120_000);
  }

  /**
   * Enable JetStream
   *
   * @returns {this}
   */
  public withJetStream(): this {
    this.withArg("--jetstream");
    return this;
  }

  public withArg(name: string, value: string): this;
  public withArg(name: string): this;
  public withArg(...args: [string, string] | [string]): this {
    const [name, value] = args;

    const correctName = NatsContainer.ensureDashInFrontOfArgumentName(name);
    this.args.add(correctName);
    if (args.length === 2) {
      this.values.set(correctName, value);
    }
    return this;
  }

  private static ensureDashInFrontOfArgumentName(name: string): string {
    if (name.startsWith("--") || name.startsWith("-")) {
      return name;
    }

    if (name.length == 1) {
      return "-" + name;
    } else {
      return "--" + name;
    }
  }

  public override async start(): Promise<StartedNatsContainer> {
    this.withCommand(this.getNormalizedCommand());
    return new StartedNatsContainer(await super.start());
  }

  private getNormalizedCommand(): string[] {
    const result: string[] = ["nats-server"];
    for (const arg of this.args) {
      result.push(arg);
      if (this.values.has(arg)) {
        const value = this.values.get(arg);
        if (value) {
          result.push(value);
        }
      }
    }
    return result;
  }
}

export class StartedNatsContainer extends AbstractStartedContainer {
  private readonly connectionServer: string;

  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer);
    const port = startedTestContainer.getMappedPort(CLIENT_PORT);
    this.connectionServer = `${this.startedTestContainer.getHost()}:${port}`;
  }

  public getConnectionServer(): string {
    return this.connectionServer;
  }
}
