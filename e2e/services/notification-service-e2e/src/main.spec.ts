import { StandardResponse } from "@ecoma/base-constract";
import { EmailNotificationConstractV1 } from "@ecoma/notification-constract";
import {
  MaildevContainer,
  NatsContainer,
  NotificationServiceContainer,
  RabbitMQContainer,
  StartedMaildevContainer,
  StartedNatsContainer,
  StartedNotificationServiceContainer,
  StartedRabbitMQContainer,
} from "@ecoma/testing-containers";
import { MaildevClient, TestLogger } from "@ecoma/testing-utils";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

describe("Email Notification Service E2E", () => {
  let natsContainer: StartedNatsContainer;
  let rabbitMQContainer: StartedRabbitMQContainer;
  let maildevContainer: StartedMaildevContainer;
  let emailNotificationServiceContainer: StartedNotificationServiceContainer;
  let client: ClientProxy;
  let maildev: MaildevClient;

  beforeAll(async () => {
    TestLogger.divider("SETUP");

    try {
      TestLogger.log("Starting Nats containers...");
      natsContainer = await new NatsContainer().start();
      TestLogger.log("Nats containers started.");
    } catch (err) {
      TestLogger.error("Failed during Nats setup", err);
      throw err;
    }

    try {
      TestLogger.log("Starting RabbitMQ containers...");
      rabbitMQContainer = await new RabbitMQContainer().start();
      TestLogger.log("RabbitMQ containers started.");
    } catch (err) {
      TestLogger.error("Failed during RabbitMQ setup", err);
      throw err;
    }

    try {
      TestLogger.log("Starting Maildev containers...");
      maildevContainer = await new MaildevContainer().start();
      maildev = new MaildevClient(maildevContainer.getApiUrl());
      TestLogger.log("Maildev containers started.");
    } catch (err) {
      TestLogger.error("Failed during Maildev setup", err);
      throw err;
    }

    try {
      TestLogger.log("Starting Email Notification Service container...");
      emailNotificationServiceContainer =
        await new NotificationServiceContainer()
          .withEnv("NATS_SERVERS", natsContainer.getConnectionServer())
          .withEnv("RABBITMQ_SERVERS", rabbitMQContainer.getAmqpUrl())
          .withEnv("SMTP_SERVER", maildevContainer.getSmtpUrl())
          .withLogConsumer((stream) => {
            stream.on("data", (line) =>
              TestLogger.log("Container log: " + line.toString())
            );
          })
          .start();
      TestLogger.log("Email Notification Service container started.");
    } catch (err) {
      TestLogger.error(
        "Failed to start Email Notification Service container",
        err
      );
      throw err;
    }

    try {
      TestLogger.log("Connecting Broker...");
      client = ClientProxyFactory.create({
        transport: Transport.NATS,
        options: {
          servers: [natsContainer.getConnectionServer()],
        },
      });
      await client.connect();
      TestLogger.log("Broker connected.");
    } catch (err) {
      TestLogger.error("Failed to connect broker", err);
      throw err;
    }
  }, 120_000);

  afterAll(async () => {
    TestLogger.divider("TEARDOWN");
    TestLogger.log("Cleaning up...");
    try {
      if (client) {
        TestLogger.log("Closing client...");
        await client.close();
      }

      if (emailNotificationServiceContainer) {
        TestLogger.log("Stopping EmailNotificationServiceContainer...");
        await emailNotificationServiceContainer.stop();
      }

      if (natsContainer) {
        TestLogger.log("Stopping natsContainer...");
        await natsContainer.stop();
      }

      if (rabbitMQContainer) {
        TestLogger.log("Stopping rabbitMQContainer...");
        await rabbitMQContainer.stop();
      }
    } catch (err) {
      TestLogger.error("Error during teardown", err);
    }
    TestLogger.log("Cleanup completed.");
  });

  it("should send email successfull", async () => {
    TestLogger.divider("CASE: should send email successfull");

    const payload = {
      from: "test@example.com",
      to: "user@example.com",
      subject: "Hello",
      text: "This is a test",
    };
    const response = await firstValueFrom(
      client.send<StandardResponse>(
        EmailNotificationConstractV1.MessageParterns.SEND,
        payload
      )
    );
    expect(response.success).toBeTruthy();

    const email = await maildev.getEmail(payload.to);
    expect(email.subject).toBe(payload.subject);
    expect(email.text.trim()).toBe(payload.text);
  });
});
