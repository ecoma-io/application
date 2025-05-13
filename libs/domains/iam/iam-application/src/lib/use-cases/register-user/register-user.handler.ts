import {
  ICommandHandler,
  IGenericResult,
} from '@ecoma/common-application'; // Adjust path
import {
  IUserRepository,
  User,
  EmailAddress,
  PasswordHash, // Assuming PasswordHasher service provides this
  UserProfile,
  EmailAlreadyExistsError as DomainEmailAlreadyExistsError,
  ITokenService, // Domain service from iam-domain
} from '@ecoma/iam-domain'; // Adjust path

import { IPasswordHasher } from '../../ports/password-hasher.port';
import { IEventPublisher } from '../../ports/event-publisher.port';
import { INdmServiceGateway } from '../../ports/ndm-gateway.port';
import { UserRegisteredEvent } from '@ecoma/iam-domain'; // Corrected path assumption
import { Password } from '@ecoma/iam-domain'; // Corrected path assumption, assuming Password VO is exported from iam-domain index

import { RegisterUserCommand } from './register-user.command';
import {
  RegisterUserEmailExistsErrorDetail,
  RegisterUserPasswordPolicyErrorDetail,
} from './register-user.error-details';

// Define a union type for all possible errors this handler can return in the Result
type RegisterUserError = RegisterUserEmailExistsErrorDetail | RegisterUserPasswordPolicyErrorDetail;

export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand, void, RegisterUserError> {
  constructor(
    // Domain Repositories & Services
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService, // Domain service for token generation
    // Application Ports (Infrastructure Gateways/Services)
    private readonly passwordHasher: IPasswordHasher,
    private readonly eventBus: IEventPublisher,
    private readonly ndmServiceGateway: INdmServiceGateway,
  ) {}

  async execute(command: RegisterUserCommand): Promise<IGenericResult<void, RegisterUserError>> {
    try {
      // 1. Validate input password policy (using Password VO if it has policy checks)
      try {
        Password.create(command.password); // This will throw if policy is violated within Password VO
      } catch (policyError: any) {
        // Assuming Password.create throws a specific error or a generic one with a message
        return Result.fail(
          new RegisterUserPasswordPolicyErrorDetail(policyError.message || 'Password policy violated.'),
        );
      }

      // 2. Check if email already exists
      const emailVO = EmailAddress.create(command.email);
      const existingUser = await this.userRepository.findByEmail(emailVO);
      if (existingUser) {
        return Result.fail(new RegisterUserEmailExistsErrorDetail(command.email));
      }

      // 3. Hash password
      const hashedPasswordString = await this.passwordHasher.hash(command.password);
      const passwordHashVO = PasswordHash.create(hashedPasswordString);

      // 4. Create User aggregate
      const userProfileVO = UserProfile.create({
        firstName: command.firstName,
        lastName: command.lastName,
        locale: command.locale,
      });

      // The User.create method in domain will set initial status and add UserRegisteredEvent.
      const user = User.create({
        email: emailVO,
        passwordHash: passwordHashVO,
        profile: userProfileVO,
        // User.create will set status to PendingConfirmation & createdAt/updatedAt
      });

      // 5. Generate email verification token (using domain service)
      const verificationTokenDetails = this.tokenService.generateEmailVerificationToken(user.id);
      user.initiateEmailVerification(verificationTokenDetails.token, verificationTokenDetails.expiresAt);

      // 6. Save user (unit of work would handle this with event publishing)
      await this.userRepository.save(user);

      // 7. Publish domain events
      // If not using UoW that automatically publishes, publish events here.
      // user.getUncommittedEvents().forEach(event => this.eventBus.publish(event));
      // For UserRegisteredEvent, payload should match the event definition.
      const userRegisteredPayload = {
        userId: user.id,
        email: user.email.value,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        locale: user.profile.locale,
        occurredAt: user.createdAt, // or now
      };
      await this.eventBus.publish(new UserRegisteredEvent(userRegisteredPayload));

      // 8. Request NDM to send verification email
      await this.ndmServiceGateway.sendVerificationEmail(
        user.id,
        user.email.value,
        user.profile.firstName,
        verificationTokenDetails.token,
        user.profile.locale,
      );

      return Result.ok();

    } catch (error) {
      // This catch block is for UNEXPECTED errors.
      // Domain-specific errors like FormatValidation should be caught by VOs and result in early return or specific ErrorDetail.
      if (error instanceof DomainEmailAlreadyExistsError) {
        // This case should ideally be caught by the check above, but as a safeguard:
        return Result.fail(new RegisterUserEmailExistsErrorDetail(error.email, error.message));
      }

      console.error(
        `[RegisterUserHandler] Unexpected error for command: ${JSON.stringify(command)}`,
        error,
      );
      // For critical failures or unexpected errors, throw them to be caught by a global error handler
      // This helps in identifying and fixing system-level issues promptly.
      throw error; // Re-throw unhandled/system errors
    }
  }
}
