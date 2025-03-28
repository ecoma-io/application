import {
  EmailNotificationWorkerContainer,
  MaildevContainer,
  RabbitMQContainer,
  StartedEmailNotificationWorkerContainer,
  StartedMaildevContainer,
  StartedRabbitMQContainer,
} from "@ecoma/testing-containers";
import { MaildevClient, TestLogger } from "@ecoma/testing-utils";
import * as amqp from "amqplib";

describe("Email Notification Worker E2E", () => {
  let rabbitMQContainer: StartedRabbitMQContainer;
  let maildevContainer: StartedMaildevContainer;
  let emailNotificationWorkerContainer: StartedEmailNotificationWorkerContainer;
  let connection: amqp.ChannelModel;
  let channel: amqp.Channel;
  let maildev: MaildevClient;

  beforeAll(async () => {
    TestLogger.divider("SETUP");

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
      TestLogger.log("Starting Email Notification Worker container...");
      emailNotificationWorkerContainer =
        await new EmailNotificationWorkerContainer()
          .withRabbitMQUri(rabbitMQContainer.getAmqpUrl())
          .withSMTPUri(maildevContainer.getSmtpUrl())
          .start();
      TestLogger.log("Email Notification Worker container started.");
    } catch (err) {
      TestLogger.error(
        "Failed to start Email Notification Worker container",
        err
      );
      throw err;
    }

    try {
      TestLogger.log("Connecting Broker...");
      connection = await amqp.connect(rabbitMQContainer.getAmqpUrl());
      channel = await connection.createChannel();
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
      if (channel) {
        TestLogger.log("Closing channel...");
        await channel.close();
      }

      if (connection) {
        TestLogger.log("Closing connection...");
        await connection.close();
      }

      if (emailNotificationWorkerContainer) {
        TestLogger.log("Stopping EmailNotificationWorkerContainer...");
        await emailNotificationWorkerContainer.stop();
      }

      if (maildevContainer) {
        TestLogger.log("Stopping maildevContainer...");
        await rabbitMQContainer.stop();
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

  it("should send email success", async () => {
    TestLogger.divider("CASE: should send email success");

    const logStream = await emailNotificationWorkerContainer.logs();
    logStream.on("data", (line) => TestLogger.log("Container log: " + line.toString()));

    const payload = {
      from: 'test@example.com',
      to: 'user@example.com',
      subject: 'Hello',
      text: 'This is a test'
    };
    const published = channel.publish(
      "",
      "email-notification-queue",
      Buffer.from(JSON.stringify(payload))
    );
    expect(published).toBe(true);
    const email = await maildev.getEmail(payload.to);
    TestLogger.log(JSON.stringify(email.text));
    expect(email.subject).toBe(payload.subject);
    expect(email.text.trim()).toBe(payload.text);
  });
});
