import {
  AbstractStartedContainer,
  GenericContainer,
  StartedTestContainer,
  Wait,
} from "testcontainers";

const POSTGRES_PORT = 5432;

/**
 * Container PostgreSQL dùng cho integration test.
 * @since 1.0.0
 */
export class PostgresContainer extends GenericContainer {
  private startedContainer: StartedTestContainer | null = null;

  constructor(
    image = "postgres:15-alpine",
    password = "test",
    user = "test",
    db = "test"
  ) {
    super(image);
    this.withExposedPorts(POSTGRES_PORT)
      .withEnvironment({
        POSTGRES_PASSWORD: password,

        POSTGRES_USER: user,

        POSTGRES_DB: db,
      })
      .withWaitStrategy(
        Wait.forLogMessage(/database system is ready to accept connections/i)
      )
      .withStartupTimeout(120_000);
  }

  /**
   * Khởi động container và trả về instance StartedPostgresContainer
   * @returns {Promise<StartedPostgresContainer>}
   */
  public override async start(): Promise<StartedPostgresContainer> {
    this.startedContainer = await super.start();
    return new StartedPostgresContainer(this.startedContainer);
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
}

/**
 * Instance PostgreSQL đã khởi động, cung cấp connection string.
 * @since 1.0.0
 */
export class StartedPostgresContainer extends AbstractStartedContainer {
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer);
  }

  /**
   * Lấy connection string để kết nối tới PostgreSQL
   * @returns {string}
   * @example
   *   const conn = started.getConnectionString('test', 'test');
   */
  public getConnectionString(
    user = "test",
    password = "test",
    db = "test"
  ): string {
    return `postgresql://${user}:${password}@${this.getHost()}:${this.getMappedPort(
      POSTGRES_PORT
    )}/${db}`;
  }
}
