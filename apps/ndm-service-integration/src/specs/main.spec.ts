import { MongoDBContainer, StartedMongoDBContainer, TestLogger, MaildevContainer, StartedMaildevContainer, MaildevClient, RabbitMQContainer, StartedRabbitMQContainer } from '@ecoma/testing';
import axios from 'axios';
import mongoose from 'mongoose';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import * as amqp from 'amqplib'; // Use import * as style

describe('Ndm Service E2E Tests', () => {
  let mongoContainer: StartedMongoDBContainer;
  let rabbitMqContainer: StartedRabbitMQContainer;
  let ndmServiceContainer: StartedTestContainer;
  let maildevContainer: StartedMaildevContainer;
  let mongoConnection: mongoose.Connection;
  let rabbitMqConnection: amqp.ChannelModel;
  let rabbitMqChannel: amqp.Channel;
  let maildevClient: MaildevClient;

  // Thiết lập môi trường test trước tất cả các test case
  beforeAll(async () => {
    TestLogger.divider('Ndm Service E2E Test Setup');
    TestLogger.log('Setting up test environment for Ndm Service E2E tests...');

    // Khởi tạo MongoDB container
    TestLogger.log('Starting MongoDB container...');
    mongoContainer = await new MongoDBContainer().start();
    TestLogger.log(`MongoDB container started at ${mongoContainer.getConnectionString()}`);

    // Khởi tạo RabbitMQ container
    TestLogger.log('Starting RabbitMQ container...');
    rabbitMqContainer = await new RabbitMQContainer().start();
    TestLogger.log(`RabbitMQ container started at ${rabbitMqContainer.getAmqpUrl()}`);

    // Khởi tạo Maildev container
    TestLogger.log('Starting Maildev container...');
    maildevContainer = await new MaildevContainer().start();
    const maildevSmtpUrl = maildevContainer.getSmtpUrl();
    const maildevApiUrl = maildevContainer.getApiUrl();
    TestLogger.log(`Maildev container started. SMTP on port ${maildevSmtpUrl}, API at ${maildevApiUrl}`);

    // Initialize MaildevClient
    maildevClient = new MaildevClient(maildevApiUrl);

    // Kết nối đến RabbitMQ
    TestLogger.log('Connecting to RabbitMQ...');
    rabbitMqConnection = await amqp.connect(rabbitMqContainer.getAmqpUrl());
    rabbitMqChannel = await rabbitMqConnection.createChannel();
    TestLogger.log('Connected to RabbitMQ and channel created successfully');

    // Ensure RabbitMQ exchange and queue exist
    TestLogger.log('Asserting RabbitMQ exchange and queue...');
    const exchange = 'notification';
    const routingKey = 'otp';
    const queue = 'otp-email'; // Assuming the worker listens to this queue for OTP emails

    await rabbitMqChannel.assertExchange(exchange, 'topic', { durable: true });
    await rabbitMqChannel.assertQueue(queue, { durable: true });
    await rabbitMqChannel.bindQueue(queue, exchange, routingKey);
    TestLogger.log(`RabbitMQ exchange "${exchange}" and queue "${queue}" asserted and bound.`);

    // Khởi tạo Ndm Service container
    TestLogger.log('Starting Ndm Service container...');
    ndmServiceContainer = await new GenericContainer('ndm-service')
      .withEnvironment({
        LOG_LEVEL: 'debug',
        LOG_FORMAT: 'text',
        MONGODB_URI: mongoContainer.getConnectionString(),
        RABBITMQ_URI: rabbitMqContainer.getAmqpUrl(),
        SMTP_URI: maildevSmtpUrl,
        PORT: '3000',
      })
      .withExposedPorts(3000)
      .withLogConsumer((stream) => {
        stream.on('data', (line: string) => {
          TestLogger.log(line);
        });
        stream.on('error', (error: Error) => {
          TestLogger.error('Error consuming logs:', error);
        });
      })
      .withWaitStrategy(Wait.forListeningPorts())
      .start();

    TestLogger.log('Started Ndm Service container successfully');

    // Cấu hình axios để trỏ đến Ndm service
    const host = ndmServiceContainer.getHost();
    const port = ndmServiceContainer.getMappedPort(3000);
    axios.defaults.baseURL = `http://${host}:${port}`;
    TestLogger.log(`Ndm Service container accessible at http://${host}:${port}`);

    // Kết nối đến MongoDB
    TestLogger.log('Connecting to MongoDB...');
    mongoConnection = await mongoose
      .createConnection(mongoContainer.getConnectionString(), {
        dbName: 'ndm',
      })
      .asPromise();
    TestLogger.log('Connected to MongoDB successfully');

    TestLogger.log('Test environment setup completed successfully!');
  }, 300_000);

  // Dọn dẹp sau khi tất cả các test hoàn thành
  afterAll(async () => {
    TestLogger.divider('Ndm Service E2E Test Teardown');

    try {
      // Đóng kết nối RabbitMQ
      if (rabbitMqChannel) {
        TestLogger.log('Closing RabbitMQ channel...');
        await rabbitMqChannel.close();
      }
      if (rabbitMqConnection) {
        TestLogger.log('Closing RabbitMQ connection...');
        await rabbitMqConnection.close();
      }

      // Đóng kết nối MongoDB
      if (mongoConnection) {
        TestLogger.log('Closing MongoDB connection...');
        await mongoConnection.close();
      }

      // Dừng các containers theo thứ tự ngược lại
      if (ndmServiceContainer) {
        TestLogger.log('Stopping Ndm Service container...');
        await ndmServiceContainer.stop();
      }
      if (maildevContainer) {
        TestLogger.log('Stopping Maildev container...');
        await maildevContainer.stop();
      }
      if (rabbitMqContainer) {
        TestLogger.log('Stopping RabbitMQ container...');
        await rabbitMqContainer.stop();
      }
      if (mongoContainer) {
        TestLogger.log('Stopping MongoDB container...');
        await mongoContainer.stop();
      }

      TestLogger.log('Test environment teardown completed successfully!');
    } catch (error) {
      TestLogger.error('Error during test teardown:', error);
      throw error;
    }
  }, 120000);

  // Xóa tất cả dữ liệu trước mỗi test
  beforeEach(async () => {
    // Clear MongoDB collections relevant to tests
    await mongoConnection.db.collection('notificationtemplates').deleteMany({});
    await mongoConnection.db.collection('notifications-histories').deleteMany({});
  });

  // Test case: Kiểm tra health endpoint
  it('should return health status OK', async () => {
    TestLogger.divider('Case: Health endpoint');
    const response = await axios.get('/health');
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('ok');
  });

  describe("templates", () => {

  });

  describe("worker", () => {
    // Basic test for worker processing OTP message
    it('should process an OTP message from RabbitMQ, save history, and send email', async () => {
      TestLogger.divider('Case: Process OTP message and send email');

      // Ensure the worker is listening by waiting a moment (can use more robust methods)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const userId = new mongoose.Types.ObjectId().toHexString();
      const email = 'test@example.com';
      const otp = '123456';

      const message = {
        userId: userId,
        email: email,
        otp: otp
      };
      const exchange = 'notification';
      const routingKey = 'otp';

      // Publish the message to RabbitMQ
      const sent = rabbitMqChannel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
      expect(sent).toBe(true);
      TestLogger.log(`Message published to exchange "${exchange}" with routing key "${routingKey}"`);

      // Wait for the worker to process the message and save to DB and send email
      // Use MaildevClient's getEmail to wait for the email
      const sentEmail = await maildevClient.getEmail(email);


      // Verify that a notification history entry was created in the database
      // We wait for the email first, as successful email sending is part of the worker logic
      const historyEntry = await mongoConnection.db.collection('notifications-histories').findOne({ email: email, notificationType: 'otp', userId: new mongoose.Types.ObjectId(userId) });

      expect(historyEntry).toBeDefined();
      expect(historyEntry?.status).toBe('sent');
      expect(historyEntry?.templateName).toBe('otp-email');

      // Verify the sent email using the retrieved email object
      expect(sentEmail).toBeDefined(); // Should be defined if getEmail succeeded
      expect(sentEmail.to.length).toBe(1);
      expect(sentEmail.to[0].address).toBe(email);
      expect(sentEmail.subject).toBe('Mã xác thực OTP');
    });
  });

});
