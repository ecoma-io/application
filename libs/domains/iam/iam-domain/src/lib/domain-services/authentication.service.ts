import { User } from '../aggregates/user.aggregate';
import { Session } from '../entities/session.entity';
import { Password } from '../value-objects/password.vo'; // For raw password input

export interface IAuthenticationResult {
    user: User;
    session: Session;
    // token: string; // Or session object contains token
}

export interface IAuthenticationService {
  authenticate(
    email: string,
    password: Password // Raw password to check
  ): Promise<IAuthenticationResult>; // Could return a Result<IAuthenticationResult, AuthenticationError>

  createSession(user: User, organizationId?: string): Promise<Session>;

  terminateSession(sessionToken: string): Promise<void>;

  // validateSessionToken(token: string): Promise<Session | null>; // Or Result<Session, TokenValidationError>
}

export const IAuthenticationService = Symbol('IAuthenticationService');
