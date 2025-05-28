import {
  AbstractStartedContainer,
  GenericContainer,
  StartedTestContainer,
  Wait,
} from "testcontainers";

const SMTP_PORT = 1025;
const WEB_PORT = 1080;

export class MaildevContainer extends GenericContainer {
  constructor(image = "maildev/maildev:2.1.0") {
    super(image);
    this.withExposedPorts(SMTP_PORT, WEB_PORT)
      .withWaitStrategy(Wait.forLogMessage("MailDev SMTP Server running at"))
      .withStartupTimeout(30_000);
  }

  public override async start(): Promise<StartedMaildevContainer> {
    return new StartedMaildevContainer(await super.start());
  }
}

export class StartedMaildevContainer extends AbstractStartedContainer {
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer);
  }

  public getSmtpUrl(): string {
    return `smtp://${this.getHost()}:${this.getMappedPort(
      SMTP_PORT
    )}?secure=false`;
  }

  public getApiUrl(): string {
    return `http://${this.getHost()}:${this.getMappedPort(WEB_PORT)}`;
  }
}
