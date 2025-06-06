import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import mongoose from 'mongoose';
import * as amqp from 'amqplib';
import { userFixtures, otpFixtures, requestFixtures, testHelpers } from '../support/fixtures';

let mongoConnection: mongoose.Connection;
let rabbitMqConnection: amqp.ChannelModel;
let rabbitMqChannel: amqp.Channel;

beforeAll(async () => {
  // Setup MongoDB connection
  mongoConnection = await mongoose.createConnection(process.env['MONGODB_URI'], { dbName: 'iam' }).asPromise();

  // Setup RabbitMQ connection
  rabbitMqConnection = await amqp.connect(process.env['RABBITMQ_URI']);
  rabbitMqChannel = await rabbitMqConnection.createChannel();

  // Setup Axios
  axios.defaults.baseURL = `https://iam.fbi.com`;
});

afterAll(async () => {
  if (rabbitMqChannel) await rabbitMqChannel.close();
  if (rabbitMqConnection) await rabbitMqConnection.close();
  if (mongoConnection) await mongoConnection.close();
});

// Xóa tất cả dữ liệu audit log trước mỗi test
beforeEach(async () => {
  await testHelpers.clearCollections(mongoConnection);
});

describe('Authenticate Feature', () => {
  describe('/authenticate/identify', () => {
    it('should get identify successfully', async () => {
      const response = await axios.post('/authenticate/identify', { email: requestFixtures.nonExistingEmail });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);
      expect(response.data.data).toBeDefined();
      expect(response.data.data).toStrictEqual({});
    });

    it('should get identify successfully with existing user', async () => {
      await testHelpers.createUser(mongoConnection, userFixtures.existingUser);

      const response = await axios.post('/authenticate/identify', { email: userFixtures.existingUser.email });
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);
      expect(response.data.data).toBeDefined();
      expect(response.data.data.firstName).toBe(userFixtures.existingUser.firstName);
    });

    it('should return 422 for missing email', async () => {
      try {
        await axios.post('/authenticate/identify', {});
        fail('Request with missing email should have failed');
      } catch (error: any) {
        expect(error.response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.details.email).toBe('email should not be empty');
      }
    });

    it('should return 422 for invalid email format', async () => {
      try {
        await axios.post('/authenticate/identify', { email: requestFixtures.invalidEmail });
        fail('Request with invalid email format should have failed');
      } catch (error: any) {
        expect(error.response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.details.email).toBe('email should be in valid standard email format');
      }
    });

    it('should return 422 for input with extra fields', async () => {
      try {
        await axios.post('/authenticate/identify', requestFixtures.extraFieldRequest);
        fail('Request with extra fields should have failed validation');
      } catch (error: any) {
        expect(error.response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.response.data.message).toBeDefined();
        expect(error.response.data.message).toBe('The request data is malformed');
      }
    });
  });

  describe('/authenticate/request-otp', () => {
    it('should request OTP successfully', async () => {
      const exchange = 'notification';
      const routingKey = 'otp';
      const queue = 'otp-email';

      await rabbitMqChannel.assertExchange(exchange, 'topic', { durable: true });
      await rabbitMqChannel.assertQueue(queue, { durable: true });
      await rabbitMqChannel.bindQueue(queue, exchange, routingKey);

      // const messagePromise = new Promise<any>((resolve) => rabbitMqChannel.consume(queue, (msg) => resolve(JSON.parse(msg.content.toString()))));

      const response = await axios.post('/authenticate/request-otp', { email: userFixtures.newUser.email });
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.data).toBeDefined();
      expect(response.data.success).toBe(true);

      // const receivedMessage = await messagePromise;
      // expect(receivedMessage).toBeDefined();
      // expect(receivedMessage.email).toBe(userFixtures.newUser.email);
    }, 20000);

    it('should request OTP successfully by manipulating database timestamp', async () => {
      // First request (should succeed)
      const firstResponse = await axios.post('/authenticate/request-otp', { email: userFixtures.rateLimitBypassUser.email });
      expect(firstResponse.status).toBe(HttpStatus.CREATED);
      expect(firstResponse.data.success).toBe(true);

      // Find user and update OTP timestamp
      const user = await testHelpers.findUser(mongoConnection, userFixtures.rateLimitBypassUser.email);
      expect(user).toBeDefined();

      const twoMinutesAgo = new Date(Date.now() - 120 * 1000);
      await testHelpers.updateOtpCreatedAt(mongoConnection, user._id, twoMinutesAgo);

      // Second request (should succeed immediately)
      const secondResponse = await axios.post('/authenticate/request-otp', { email: userFixtures.rateLimitBypassUser.email });
      expect(secondResponse.status).toBe(HttpStatus.CREATED);
      expect(secondResponse.data.success).toBe(true);
    });

    it('should return error when requesting OTP too fast', async () => {
      // First request (should succeed)
      const firstResponse = await axios.post('/authenticate/request-otp', { email: userFixtures.rateLimitUser.email });
      expect(firstResponse.status).toBe(HttpStatus.CREATED);
      expect(firstResponse.data.success).toBe(true);

      // Second request (should fail with rate limit)
      try {
        await axios.post('/authenticate/request-otp', { email: userFixtures.rateLimitUser.email });
        fail('Requesting OTP too fast should have returned an error');
      } catch (error: any) {
        expect(error.response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.message).toBe('You are requesting to send otp too quickly. Please try again later!');
      }

      // Third request (should still fail with rate limit)
      try {
        await axios.post('/authenticate/request-otp', { email: userFixtures.rateLimitUser.email });
        fail('Requesting OTP too fast should have returned an error');
      } catch (error: any) {
        expect(error.response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.message).toBe('You are requesting to send otp too quickly. Please try again later!');
      }
    });

    it('should return 422 for missing email', async () => {
      try {
        await axios.post('/authenticate/request-otp', {});
        fail('Request with missing email should have failed');
      } catch (error: any) {
        expect(error.response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.details.email).toBe('email should not be empty');
      }
    });

    it('should return 422 for invalid email format', async () => {
      try {
        await axios.post('/authenticate/request-otp', { email: requestFixtures.invalidEmail });
        fail('Request with invalid email format should have failed');
      } catch (error: any) {
        expect(error.response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.details.email).toBe('email should be in valid standard email format');
      }
    });

    it('should return 400 for input with extra fields', async () => {
      try {
        await axios.post('/authenticate/request-otp', requestFixtures.extraFieldRequest);
        fail('Request with extra fields should have failed validation');
      } catch (error: any) {
        expect(error.response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(error.response.data.message).toBeDefined();
        expect(error.response.data.message).toBe('The request data is malformed');
      }
    });
  });

  // describe("/authenticate/login", () => {

  //   it("should sign in successfully with valid OTP", async () => {
  //     // Request OTP and get user
  //     await axios.post("/authenticate/request-otp", { email: userFixtures.signInUser.email });
  //     const user = await testHelpers.findUser(mongoConnection, userFixtures.signInUser.email);
  //     const otpDoc = await testHelpers.findOtp(mongoConnection, user._id);
  //     expect(otpDoc).toBeDefined();

  //     const response = await axios.post("/authenticate/login", {
  //       email: userFixtures.signInUser.email,
  //       otp: otpDoc.code
  //     });
  //     expect(response.status).toBe(HttpStatus.ACCEPTED);
  //     expect(response.data.success).toBe(true);
  //     expect(response.data.data).toBeDefined();
  //     expect(response.data.data.token).toBeDefined();
  //     expect(response.data.data.id).toBeDefined();
  //     expect(response.data.data.email).toBe(userFixtures.signInUser.email);
  //   });

  //   it("should return 404 if user does not exist", async () => {
  //     try {
  //       await axios.post("/authenticate/login", {
  //         email: requestFixtures.nonExistingEmail,
  //         otp: "123456"
  //       });
  //       fail("Sign in with non-existent user should fail");
  //     } catch (error: any) {
  //       expect(error.response.status).toBe(HttpStatus.NOT_FOUND);
  //       expect(error.response.data.message).toBe("User not found.");
  //     }
  //   });

  //   it("should return 401 if OTP is invalid", async () => {
  //     await axios.post("/authenticate/request-otp", { email: userFixtures.invalidOtpUser.email });
  //     try {
  //       await axios.post("/authenticate/login", {
  //         email: userFixtures.invalidOtpUser.email,
  //         otp: "000000"
  //       });
  //       fail("Sign in with invalid OTP should fail");
  //     } catch (error: any) {
  //       expect(error.response.status).toBe(HttpStatus.UNAUTHORIZED);
  //       expect(error.response.data.message).toBe("OTP is invalid or expired.");
  //     }
  //   });

  //   it("should return 401 if OTP is expired", async () => {
  //     // Request OTP and get user
  //     await axios.post("/authenticate/request-otp", { email: userFixtures.expiredOtpUser.email });
  //     const user = await testHelpers.findUser(mongoConnection, userFixtures.expiredOtpUser.email);
  //     const otpDoc = await testHelpers.findOtp(mongoConnection, user._id);

  //     // Update OTP to be expired
  //     const expiredDate = new Date(Date.now() - 60 * 1000);
  //     await testHelpers.updateOtpExpiry(mongoConnection, otpDoc._id, expiredDate);

  //     try {
  //       await axios.post("/authenticate/login", {
  //         email: userFixtures.expiredOtpUser.email,
  //         otp: otpDoc.code
  //       });
  //       fail("Sign in with expired OTP should fail");
  //     } catch (error: any) {
  //       expect(error.response.status).toBe(HttpStatus.UNAUTHORIZED);
  //       expect(error.response.data.message).toBe("OTP is invalid or expired.");
  //     }
  //   });
  // });
});
