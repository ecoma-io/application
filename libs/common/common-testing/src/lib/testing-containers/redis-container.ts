import {
  AbstractStartedContainer,
  GenericContainer,
  StartedTestContainer,
  Wait,
} from "testcontainers";

const REDIS_PORT = 6379;

export class RedisContainer extends GenericContainer {
  private persistenceVolume?: string;

  constructor(image = "redis:7.2") {
    super(image);
    this.withExposedPorts(REDIS_PORT)
      .withStartupTimeout(120_000)
      .withWaitStrategy(Wait.forLogMessage("Ready to accept connections"));
  }

  public withPersistence(sourcePath: string): this {
    this.persistenceVolume = sourcePath;
    return this;
  }

  public override async start(): Promise<StartedRedisContainer> {
    const redisCommand = [
      "redis-server",
      ...(this.persistenceVolume
        ? ["--save", "1", "1", "--appendonly", "yes"]
        : []),
    ];

    this.withCommand(redisCommand);

    if (this.persistenceVolume) {
      this.withBindMounts([
        { mode: "rw", source: this.persistenceVolume, target: "/data" },
      ]);
    }

    const startedContainer = await super.start();
    return new StartedRedisContainer(startedContainer);
  }
}

export class StartedRedisContainer extends AbstractStartedContainer {
  constructor(
    protected override readonly startedTestContainer: StartedTestContainer
  ) {
    super(startedTestContainer);
  }

  public getPort(): number {
    return this.getMappedPort(REDIS_PORT);
  }

  public getConnectionUrl(): string {
    const url = new URL("redis://");
    url.hostname = this.getHost();
    url.port = this.getPort().toString();
    return url.toString();
  }

  public async executeCliCmd(
    cmd: string,
    additionalFlags: string[] = []
  ): Promise<string> {
    const result = await this.startedTestContainer.exec([
      "redis-cli",
      ...cmd.split(" "),
      ...additionalFlags,
    ]);

    if (result.exitCode !== 0) {
      throw new Error(
        `executeCliCmd failed with exit code ${result.exitCode} for command: ${cmd}. ${result.output}`
      );
    }

    return result.output;
  }
}
