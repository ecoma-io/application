import {
  AbstractStartedContainer,
  ExecResult,
  GenericContainer,
  StartedTestContainer,
  Wait,
} from "testcontainers";

const MONGODB_PORT = 27017;

export class MongoDBContainer extends GenericContainer {
  private startedContainer: StartedTestContainer | null = null;

  constructor(image = "mongo:4.0.1") {
    super(image);
    this.withExposedPorts(MONGODB_PORT)
      .withCommand(["--replSet", "rs0"])
      .withWaitStrategy(Wait.forLogMessage(/.*waiting for connections.*/i))
      .withStartupTimeout(120_000);
  }

  public override async start(): Promise<StartedMongoDBContainer> {
    this.startedContainer = await super.start();
    return new StartedMongoDBContainer(this.startedContainer);
  }

  /**
   * Dừng container sau khi sử dụng
   * @returns {Promise<void>}
   */
  public async stop(): Promise<void> {
    if (this.startedContainer) {
      await this.startedContainer.stop();
      this.startedContainer = null;
    }
  }

  protected override async containerStarted(
    startedTestContainer: StartedTestContainer
  ): Promise<void> {
    await this.initReplicaSet(startedTestContainer);
  }

  private async initReplicaSet(startedTestContainer: StartedTestContainer) {
    await this.executeMongoEvalCommand(startedTestContainer, "rs.initiate();");
    await this.executeMongoEvalCommand(
      startedTestContainer,
      this.buildMongoWaitCommand()
    );
  }

  private async executeMongoEvalCommand(
    startedTestContainer: StartedTestContainer,
    command: string
  ) {
    const execResult = await startedTestContainer.exec(
      this.buildMongoEvalCommand(command)
    );
    this.checkMongoNodeExitCode(execResult);
  }

  private buildMongoEvalCommand(command: string) {
    return [this.getMongoCmdBasedOnImageTag(), "--eval", command];
  }

  private getMongoCmdBasedOnImageTag() {
    return parseInt(this.imageName.tag[0]) >= 5 ? "mongosh" : "mongo";
  }

  private checkMongoNodeExitCode(execResult: ExecResult) {
    const { exitCode, output } = execResult;
    if (execResult.exitCode !== 0) {
      throw new Error(
        `Error running mongo command. Exit code ${exitCode}: ${output}`
      );
    }
  }

  private buildMongoWaitCommand() {
    return `
    var attempt = 0;
    while(db.runCommand({isMaster: 1}).ismaster==false) {
      if (attempt > 60) {
        quit(1);
      }
      print(attempt); sleep(100); attempt++;
    }
    `;
  }
}

export class StartedMongoDBContainer extends AbstractStartedContainer {
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer);
  }

  public getConnectionString(): string {
    return `mongodb://${this.getHost()}:${this.getMappedPort(
      MONGODB_PORT
    )}?directConnection=true`;
  }
}
