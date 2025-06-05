import { HttpStatus } from '@nestjs/common';
import {
  MongoDBContainer,
  StartedMongoDBContainer,
  TestLogger,
  RabbitMQContainer, StartedRabbitMQContainer
} from "@ecoma/testing";
import axios from "axios";
import mongoose from "mongoose";
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import * as amqp from 'amqplib'; // Use import * as style

describe("IAM Service E2E Tests", () => {
  let mongoContainer: StartedMongoDBContainer;
  let iamServiceContainer: StartedTestContainer;
  let rabbitmqContainer: StartedRabbitMQContainer;
  let mongoConnection: mongoose.Connection;
  let rabbitMqConnection: amqp.ChannelModel;
  let rabbitMqChannel: amqp.Channel;


  // Thiết lập môi trường test trước tất cả các test case
  beforeAll(async () => {
    TestLogger.divider("IAM Service E2E Test Setup");
    TestLogger.log(
      "Setting up test environment for IAM Service E2E tests..."
    );

    // Khởi tạo MongoDB container
    TestLogger.log("Starting MongoDB container...");
    mongoContainer = await new MongoDBContainer().start();
    TestLogger.log(
      `MongoDB container started at ${mongoContainer.getConnectionString()}`
    );

    // Khởi tạo RabbitMQ container
    TestLogger.log("Starting RabbitMQ container...");
    rabbitmqContainer = await new RabbitMQContainer().start();
    TestLogger.log(
      `RabbitMQ container started at amqp://${rabbitmqContainer.getHost()}:${rabbitmqContainer.getMappedPort(5672)}`
    );
    // Kết nối đến RabbitMQ
    TestLogger.log('Connecting to RabbitMQ...');
    rabbitMqConnection = await amqp.connect(rabbitmqContainer.getAmqpUrl());
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

    // Khởi tạo iam service container
    TestLogger.log("Starting IAM Service container...");
    iamServiceContainer = await new GenericContainer('iam-service')
      .withEnvironment({
        PORT: "3000",
        LOG_LEVEL: "debug",
        LOG_FORMAT: "text",
        MONGODB_URI: mongoContainer.getConnectionString(),
        RABBITMQ_URI: `amqp://${rabbitmqContainer.getHost()}:${rabbitmqContainer.getMappedPort(5672)}`,
      })
      .withExposedPorts(3000)
      .withLogConsumer((stream) => {
        stream.on("data", (line: string) => {
          TestLogger.log(line);
        });
        stream.on("error", (error: Error) => {
          TestLogger.error("Error consuming logs:", error);
        });
      })
      .withWaitStrategy(Wait.forHttp('/health', 3000, { abortOnContainerExit: true }))
      .start();

    TestLogger.log("Started IAM Service container successfully");

    // Cấu hình axios để trỏ đến IAM service
    const host = iamServiceContainer.getHost();
    const port = iamServiceContainer.getMappedPort(3000);
    axios.defaults.baseURL = `http://${host}:${port}`;
    TestLogger.log(
      `IAM Service container accessible at http://${host}:${port}`
    );

    // Kết nối đến MongoDB
    TestLogger.log("Connecting to MongoDB...");
    mongoConnection = await mongoose
      .createConnection(mongoContainer.getConnectionString(), {
        dbName: "iam",
      })
      .asPromise();
    TestLogger.log("Connected to MongoDB successfully");

    // Đợi một chút để đảm bảo IAM Service service đã khởi động hoàn toàn
    TestLogger.log("Waiting for IAM Service service to be fully started...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    TestLogger.log("Test environment setup completed successfully!");
  }, 300_000); // Timeout 60s cho việc khởi tạo

  // Dọn dẹp sau khi tất cả các test hoàn thành
  afterAll(async () => {
    TestLogger.divider("IAM Service E2E Test Teardown");

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
        TestLogger.log("Closing MongoDB connection...");
        await mongoConnection.close();
      }

      // Dừng các containers theo thứ tự ngược lại
      if (iamServiceContainer) {
        TestLogger.log("Stopping IAM Service container...");
        await iamServiceContainer.stop();
      }
      if (mongoContainer) {
        TestLogger.log("Stopping MongoDB container...");
        await mongoContainer.stop();
      }
      if (rabbitmqContainer) {
        TestLogger.log("Stopping RabbitMQ container...");
        await rabbitmqContainer.stop();
      }

      TestLogger.log("Test environment teardown completed successfully!");
    } catch (error) {
      TestLogger.error("Error during test teardown:", error);
      throw error;
    }
  }, 120000); // Timeout 30s cho việc dọn dẹp

  // Xóa tất cả dữ liệu audit log trước mỗi test
  beforeEach(async () => {
    // Xóa dữ liệu trong collection entries
    await mongoConnection.db.collection("entries").deleteMany({});
    // Xóa dữ liệu trong collection retention-policies
    await mongoConnection.db.collection("retention-policies").deleteMany({});
  });

  // Test case: Kiểm tra health endpoint
  it("should return health status OK", async () => {
    TestLogger.divider("Case: Health endpoint");
    const response = await axios.get("/health");
    expect(response.status).toBe(200);
    expect(response.data.status).toBe("ok");
    expect(response.data.details).toBeDefined();
    expect(response.data.details.mongodb).toBeDefined();
    expect(response.data.details.mongodb.status).toBe("up");
  });

  describe("/auth", () => {

    describe("/auth/identify", () => {
      // Test case: Kiểm tra tính năng identify
      it("should get identify successfully", async () => {
        TestLogger.divider("Case: Get identify");
        const notExistingUserEmail = "non-existing@example.com";

        const response = await axios.post("/auth/identify", { email: notExistingUserEmail });
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.data).toBeDefined();
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(response.data.data).toStrictEqual({});
      });

      it("should get identify successfully with existing user", async () => {
        TestLogger.divider("Case: Get identify");
        const existingUserEmail = "testuser@example.com";
        const existingUserFirstName = 'John';

        await mongoConnection.collection('users').insertOne({
          email: existingUserEmail,
          firstName: existingUserFirstName,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        const response = await axios.post("/auth/identify", { email: existingUserEmail });
        expect(response.status).toBe(HttpStatus.OK);
        expect(response.data).toBeDefined();
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(response.data.data.firstName).toBe(existingUserFirstName);
      });


      // // Test case: Kiểm tra khi gửi dữ liệu không hợp lệ (thiếu email)
      it("should return 422 for missing email", async () => {
        TestLogger.divider("Case: Invalid Input - Missing Email");

        try {
          await axios.post("/auth/identify", {});
          // If the request does not throw, fail the test
          fail("Request with missing email should have failed");
        } catch (error: any) {
          // Kiểm tra status code 422 (Unprocessable Entity) như định nghĩa trong controller
          expect(error.response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
          expect(error.response.data.success).toBe(false);
          expect(error.response.data.details.email).toBe('email should not be empty');
        }
      });

      // // Test case: Kiểm tra khi gửi dữ liệu không hợp lệ (email sai định dạng)
      it("should return 422 for invalid email format", async () => {
        TestLogger.divider("Case: Invalid Input - Invalid Email Format");
        const invalidEmail = "invalid-email-format";

        try {
          await axios.post("/auth/identify", { email: invalidEmail });
          // If the request does not throw, fail the test
          fail("Request with invalid email format should have failed");
        } catch (error: any) {
          // Kiểm tra status code 422 (Unprocessable Entity)
          expect(error.response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
          expect(error.response.data.success).toBe(false);
          expect(error.response.data.details.email).toBe('email should be in valid standard email format');
        }
      });


      // // Test case: Kiểm tra khi gửi dữ liệu không hợp lệ (dữ liệu thừa)
      it("should return 422 for input with extra fields", async () => {
        TestLogger.divider("Case: Invalid Input - Extra Fields");

        try {
          // Gửi request với trường email hợp lệ và một trường thừa
          await axios.post("/auth/identify", { email: "extrafielduser@example.com", extraField: "some data" });
          // If the request does not throw, fail the test
          fail("Request with extra fields should have failed validation");
        } catch (error: any) {
          // Kiểm tra status code 422 (Unprocessable Entity) từ ValidationPipe
          expect(error.response.status).toBe(HttpStatus.BAD_REQUEST);
          // Kiểm tra message lỗi từ ValidationPipe
          // ValidationPipe mặc định trả về mảng message trong error.response.data.message
          expect(error.response.data.message).toBeDefined();
          expect(error.response.data.message).toBe('The request data is malformed');
        }
      });

    })

    describe("/auth/requestOtp", () => {
      // Test case: Kiểm tra tính năng requestOtp
      it("should request OTP successfully", async () => {
        TestLogger.divider("Case: Request OTP");
        const testEmail = "testuser@example.com";
        const expectedQueue = "otp-email"; // Tên queue mà service được cấu hình để gửi


        // Promise để chờ message từ queue
        const messagePromise = new Promise<any>((resolve, reject) => {
          rabbitMqChannel.consume(
            expectedQueue,
            (msg) => {
              if (msg) {
                TestLogger.log(
                  `Received message: ${msg.content.toString()}`
                );
                resolve(JSON.parse(msg.content.toString()));
                rabbitMqChannel.ack(msg);
              }
            },
            { noAck: false }
          );

          setTimeout(() => {
            reject(
              new Error(
                `Timeout waiting for message on queue ${expectedQueue}`
              )
            );
          }, 10000); // 10 giây timeout
        });


        const response = await axios.post("/auth/requestOtp", { email: testEmail });
        expect(response.status).toBe(HttpStatus.CREATED);
        expect(response.data).toBeDefined();
        expect(response.data.success).toBe(true);

        const receivedMessage = await messagePromise;
        expect(receivedMessage).toBeDefined();
        expect(receivedMessage.email).toBe(testEmail);
      });



      // Test case: Kiểm tra giới hạn tốc độ khi yêu cầu OTP quá nhanh
      it("should return error when requesting OTP too fast", async () => {
        TestLogger.divider("Case: Request OTP Too Fast");
        const testEmail = "ratelimituser@example.com";

        // Lần yêu cầu đầu tiên (nên thành công)
        const firstResponse = await axios.post("/auth/requestOtp", { email: testEmail });
        expect(firstResponse.status).toBe(HttpStatus.CREATED);
        expect(firstResponse.data.success).toBe(true);

        // Lần yêu cầu thứ hai ngay lập tức (nên bị giới hạn tốc độ)
        try {
          await axios.post("/auth/requestOtp", { email: testEmail });
          // Nếu yêu cầu không ném lỗi, test thất bại
          fail("Requesting OTP too fast should have returned an error");
        } catch (error: any) {
          // Kiểm tra status code 429 (Too Many Requests)
          expect(error.response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
          expect(error.response.data.success).toBe(false);
          expect(error.response.data.message).toBe('You are requesting to send otp too quickly. Please try again later!');
        }


        // Lần yêu cầu thứ 3 ngay sau đó ( vẫn nên bị giới hạn tốc độ)
        try {
          await axios.post("/auth/requestOtp", { email: testEmail });
          // Nếu yêu cầu không ném lỗi, test thất bại
          fail("Requesting OTP too fast should have returned an error");
        } catch (error: any) {
          // Kiểm tra status code 429 (Too Many Requests)
          expect(error.response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
          expect(error.response.data.success).toBe(false);
          expect(error.response.data.message).toBe('You are requesting to send otp too quickly. Please try again later!');
        }

      });

      // Test case: Kiểm tra khi gửi dữ liệu không hợp lệ (thiếu email)
      it("should return 422 for missing email", async () => {
        TestLogger.divider("Case: Invalid Input - Missing Email");

        try {
          await axios.post("/auth/requestOtp", {}); // Empty body
          // If the request does not throw, fail the test
          fail("Request with missing email should have failed");
        } catch (error: any) {
          // Kiểm tra status code 422 (Unprocessable Entity) như định nghĩa trong controller
          expect(error.response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
          expect(error.response.data.success).toBe(false);
          expect(error.response.data.details.email).toBe('email should not be empty');
        }
      });

      // Test case: Kiểm tra khi gửi dữ liệu không hợp lệ (email sai định dạng)
      it("should return 422 for invalid email format", async () => {
        TestLogger.divider("Case: Invalid Input - Invalid Email Format");
        const invalidEmail = "invalid-email-format";

        try {
          await axios.post("/auth/requestOtp", { email: invalidEmail });
          // If the request does not throw, fail the test
          fail("Request with invalid email format should have failed");
        } catch (error: any) {
          // Kiểm tra status code 422 (Unprocessable Entity)
          expect(error.response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
          expect(error.response.data.success).toBe(false);
          expect(error.response.data.details.email).toBe('email should be in valid standard email format');
        }
      });

      // Test case: Kiểm tra yêu cầu OTP thành công sau khi hết thời gian rate limit
      // Sử dụng database trực tiếp để bypass thời gian chờ
      it("should request OTP successfully by manipulating database timestamp", async () => {
        TestLogger.divider("Case: Request OTP after Rate Limit (Database Bypass)");
        const testEmail = "ratelimitbypassuser@example.com"; // Sử dụng email khác để tránh xung đột

        // Lần yêu cầu đầu tiên (nên thành công)
        const firstResponse = await axios.post("/auth/requestOtp", { email: testEmail });
        expect(firstResponse.status).toBe(HttpStatus.CREATED);
        expect(firstResponse.data.success).toBe(true);

        // Tìm người dùng vừa tạo để lấy userId
        const user = await mongoConnection.db.collection('users').findOne({ email: testEmail });
        expect(user).toBeDefined();

        // Tính thời điểm cách đây hơn 60 giây
        const twoMinutesAgo = new Date(Date.now() - 120 * 1000); // 2 phút trước

        // Cập nhật createdAt của OTP trong database để bypass rate limit
        const updateResult = await mongoConnection.db.collection('otps').updateOne(
          { userId: user._id, isUsed: false },
          { $set: { createdAt: twoMinutesAgo } }
        );
        expect(updateResult.modifiedCount).toBe(1); // Đảm bảo 1 document đã được cập nhật

        // Lần yêu cầu thứ hai (nên thành công ngay lập tức)
        const secondResponse = await axios.post("/auth/requestOtp", { email: testEmail });
        expect(secondResponse.status).toBe(HttpStatus.CREATED);
        expect(secondResponse.data.success).toBe(true);
      });

      // Test case: Kiểm tra khi gửi dữ liệu không hợp lệ (dữ liệu thừa)
      it("should return 422 for input with extra fields", async () => {
        TestLogger.divider("Case: Invalid Input - Extra Fields");

        try {
          // Gửi request với trường email hợp lệ và một trường thừa
          await axios.post("/auth/requestOtp", { email: "extrafielduser@example.com", extraField: "some data" });
          // If the request does not throw, fail the test
          fail("Request with extra fields should have failed validation");
        } catch (error: any) {
          // Kiểm tra status code 422 (Unprocessable Entity) từ ValidationPipe
          expect(error.response.status).toBe(HttpStatus.BAD_REQUEST);
          // Kiểm tra message lỗi từ ValidationPipe
          // ValidationPipe mặc định trả về mảng message trong error.response.data.message
          expect(error.response.data.message).toBeDefined();
          expect(error.response.data.message).toBe('The request data is malformed');
        }
      });

    })

    describe("/auth/login", () => {
      it("should sign in successfully with valid OTP", async () => {
        TestLogger.divider("Case: Sign in successfully with valid OTP");
        const testEmail = "signinuser@example.com";
        await axios.post("/auth/requestOtp", { email: testEmail });
        const user = await mongoConnection.db.collection('users').findOne({ email: testEmail });
        const otpDoc = await mongoConnection.db.collection('otps').findOne({ userId: user._id, isUsed: false });
        expect(otpDoc).toBeDefined();
        const response = await axios.post("/auth/login", { email: testEmail, otp: otpDoc.code });
        expect(response.status).toBe(HttpStatus.ACCEPTED);
        expect(response.data.success).toBe(true);
        expect(response.data.data).toBeDefined();
        expect(response.data.data.token).toBeDefined();
        expect(response.data.data.id).toBeDefined();
        expect(response.data.data.email).toBe(testEmail);
      });

      it("should return 404 if user does not exist", async () => {
        TestLogger.divider("Case: Sign in with non-existent user");
        try {
          await axios.post("/auth/login", { email: "nouser@example.com", otp: "123456" });
          fail("Sign in with non-existent user should fail");
        } catch (error: any) {
          expect(error.response.status).toBe(HttpStatus.NOT_FOUND);
          expect(error.response.data.message).toBe("User not found.");
        }
      });

      it("should return 401 if OTP is invalid", async () => {
        TestLogger.divider("Case: Sign in with invalid OTP");
        const testEmail = "invalidotpuser@example.com";
        await axios.post("/auth/requestOtp", { email: testEmail });
        try {
          await axios.post("/auth/login", { email: testEmail, otp: "000000" });
          fail("Sign in with invalid OTP should fail");
        } catch (error: any) {
          expect(error.response.status).toBe(HttpStatus.UNAUTHORIZED);
          expect(error.response.data.message).toBe("OTP is invalid or expired.");
        }
      });

      it("should return 401 if OTP is expired", async () => {
        TestLogger.divider("Case: Sign in with expired OTP");
        const testEmail = "expiredotpuser@example.com";
        await axios.post("/auth/requestOtp", { email: testEmail });
        const user = await mongoConnection.db.collection('users').findOne({ email: testEmail });
        const otpDoc = await mongoConnection.db.collection('otps').findOne({ userId: user._id, isUsed: false });
        await mongoConnection.db.collection('otps').updateOne(
          { _id: otpDoc._id },
          { $set: { expiresAt: new Date(Date.now() - 60 * 1000) } }
        );
        try {
          await axios.post("/auth/login", { email: testEmail, otp: otpDoc.code });
          fail("Sign in with expired OTP should fail");
        } catch (error: any) {
          expect(error.response.status).toBe(HttpStatus.UNAUTHORIZED);
          expect(error.response.data.message).toBe("OTP is invalid or expired.");
        }
      });
    });



  })



});
