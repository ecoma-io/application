import { Injectable } from "@nestjs/common";
import { AuthIdentifyDTO, AuthIdentifyResponseDTO, AuthRequestOtpDTO, AuthSignInDTO, AuthSignInResponseDto } from "@ecoma/iam-service-dtos";
import { SessionRepository, UserRepository } from "../database/repositories";
import { OTPRepository } from "../database/repositories/otp.repository";
import { PinoLogger } from "@ecoma/nestjs-logger";
import { SucessResponseDto } from "@ecoma/dtos";
import { v7 as uuidv7 } from 'uuid';
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { TooMananyRequestOtpException, UserNotFoundException, InvalidOrExpiredOtpException } from "./authenticate.errors";


@Injectable()
export class AuthenticateService {


  private logger = new PinoLogger(AuthenticateService.name);

  constructor(
    private sessionRepo: SessionRepository,
    private userRepo: UserRepository,
    private otpRepo: OTPRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {

  }

  /**
   * Get basic user identification information
   * @param authIdentifyDTO - Data transfer object containing user email for identification
   * @returns Promise<AuthIdentifyResponseDTO> - Response containing user's first and last name if found, empty object if not found
   * @throws {Error} - If there is an error accessing the database
   */
  async identify(authIdentifyDTO: AuthIdentifyDTO): Promise<AuthIdentifyResponseDTO> {
    this.logger.debug({ email: authIdentifyDTO.email }, 'Getting user identity');
    const user = await this.userRepo.findByEmail(authIdentifyDTO.email);
    if (user) {
      return { success: true, data: { firstName: user.firstName, lastName: user.lastName } }
    } else {
      return { success: true, data: {} }
    }
  }

  /**
   *
   * Requests a one-time password.
   * @param requestOtpDTO - Data transfer object for OTP request.
   * @returns A promise that resolves to a response object indicating the status of the OTP request.
   */
  async requestOTP(requestOtpDTO: AuthRequestOtpDTO): Promise<SucessResponseDto> {
    this.logger.debug({ email: requestOtpDTO.email }, 'Starting OTP request process');

    // 1. Find or create user
    let user = await this.userRepo.findByEmail(requestOtpDTO.email);
    if (!user) {
      this.logger.info({ email: requestOtpDTO.email }, 'Creating new user');
      user = await this.userRepo.create({ email: requestOtpDTO.email });
    } else {
      this.logger.debug({ userId: user._id }, 'Existing user found');
    }

    // 2. Check for recent unused OTP to implement rate limiting (1 minute)
    const latestUnusedOtp = await this.otpRepo.findUnusedByUserId(user._id);
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    if (latestUnusedOtp && latestUnusedOtp.createdAt && latestUnusedOtp.createdAt > oneMinuteAgo) {
      this.logger.debug({
        userId: user._id,
        lastOtpCreatedAt: latestUnusedOtp.createdAt,
        message: 'Rate limit exceeded for OTP requests'
      }, 'Rate limit exceeded for OTP requests');
      throw new TooMananyRequestOtpException();
    }

    // 3. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    this.logger.debug({
      userId: user._id,
      expiresAt: otpExpiresAt
    }, 'Generated new OTP');

    // 4. Store or update OTP
    await this.otpRepo.createOrUpdateOtp({
      userId: user._id,
      token: otp,
      expiresAt: otpExpiresAt,
      isUsed: false
    });
    this.logger.debug({ userId: user._id }, 'OTP stored successfully');

    // 5. Send OTP
    this.logger.info({ userId: user._id, email: user.email }, 'OTP ready to be sent');
    try {
      await this.amqpConnection.publish(
        'notification',
        'otp',
        {
          userId: user._id,
          email: user.email,
          firstName: user.firstName,
          otp: otp
        }
      );
      this.logger.debug({ userId: user._id, email: user.email }, 'OTP message published to RabbitMQ');
    } catch (error) {
      this.logger.error({ userId: user._id, email: user.email, err: error }, 'Failed to publish OTP message to RabbitMQ');
    }

    // 6. Return response
    this.logger.debug({ userId: user._id }, 'OTP request completed successfully');
    return { success: true };
  }

  /**
   * Handles user sign in.
   * @param signInDTO - Data transfer object for sign in.
   * @param headers - The headers from the request.
   * @returns A promise that resolves to a response object indicating the status of the login attempt.
   */
  async signIn(signInDTO: AuthSignInDTO, headers: Record<string, string>): Promise<AuthSignInResponseDto> {
    this.logger.debug({ email: signInDTO.email }, 'Starting sign in process');

    // 1. Find the user by email
    this.logger.debug({ email: signInDTO.email }, 'Finding user by email');
    const user = await this.userRepo.findByEmail(signInDTO.email);

    // 2. Check if user exists
    if (!user) {
      this.logger.debug({ email: signInDTO.email }, 'User not found');
      throw new UserNotFoundException();
    }
    this.logger.debug({ userId: user._id }, 'User found');

    // 3. Find valid OTP for the user and provided code using the new method
    this.logger.debug({ userId: user._id, otp: signInDTO.otp }, 'Checking OTP validity');
    const validOtp = await this.otpRepo.findValidOtp(user._id, signInDTO.otp);

    // 4. Verify if OTP is valid and not expired (findValidOtp handles this)
    if (!validOtp) {
      this.logger.debug({ userId: user._id, otp: signInDTO.otp }, 'OTP is invalid or expired');
      throw new InvalidOrExpiredOtpException();
    }
    this.logger.debug({ userId: user._id, otp: signInDTO.otp }, 'OTP is valid');

    // 5. OTP is valid, invalidate it using createOrUpdateOtp
    await this.otpRepo.createOrUpdateOtp({ userId: user._id, token: validOtp.code, expiresAt: validOtp.expiresAt, isUsed: true });
    this.logger.debug({ userId: user._id, otp: signInDTO.otp }, 'OTP invalidated');

    // 6. Generate session token using uuid v7
    const token = uuidv7();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry, adjust as needed
    const userAgent = headers['user-agent'] || 'unknown';
    await this.sessionRepo.create({
      userId: user._id,
      userAgent,
      roleVersion: 1, // Adjust as needed
      expiresAt
    });
    this.logger.debug({ userId: user._id, token, userAgent }, 'Session created');

    // 7. Return success response with session token and user info
    this.logger.debug({ userId: user._id, token }, 'Sign in completed successfully');
    return {
      success: true,
      data: {
        token,
        id: user._id?.toString?.(),
        email: user.email,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? ''
      }
    };
  }


  /**
   * Handles user sign out.
   * @returns A promise that resolves to a response object indicating the status of the logout attempt.
   */
  signOut(): Promise<SucessResponseDto> {
    throw new Error("Method not implemented.");
  }

}
