import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

// Entities
import { UserEntity, OrganizationEntity, MembershipEntity, SessionEntity } from './persistence/typeorm/entities';

// Repositories
import { UserRepository } from './persistence/repositories/user.repository';
import { OrganizationRepository } from './persistence/repositories/organization.repository';
import { SessionRepository } from './persistence/repositories/session.repository';

// Services
import { PasswordService, TokenService, SessionService, NotificationService } from './services';

// External Clients
import { BumClient } from './external-clients';

// Command & Query Handlers từ Application Layer
import {
  RegisterUserHandler,
  LoginUserHandler,
  LogoutUserHandler,
  VerifyEmailHandler,
  RequestPasswordResetHandler,
  ResetPasswordHandler,
  CreateOrganizationHandler
} from '@ecoma/iam-application';

import {
  GetUserByEmailHandler,
  GetUserByIdHandler,
  GetOrganizationByIdHandler,
  GetOrganizationBySlugHandler
} from '@ecoma/iam-application';

// Khai báo danh sách các command handlers
const commandHandlers = [
  RegisterUserHandler,
  LoginUserHandler,
  LogoutUserHandler,
  VerifyEmailHandler,
  RequestPasswordResetHandler,
  ResetPasswordHandler,
  CreateOrganizationHandler
];

// Khai báo danh sách các query handlers
const queryHandlers = [
  GetUserByEmailHandler,
  GetUserByIdHandler,
  GetOrganizationByIdHandler,
  GetOrganizationBySlugHandler
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      UserEntity,
      OrganizationEntity,
      MembershipEntity,
      SessionEntity
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'development_secret',
        signOptions: {
          expiresIn: '1h'
        }
      })
    })
  ],
  providers: [
    // Logger
    {
      provide: 'ILogger',
      useFactory: () => {
        const logger = new Logger('IAM');
        return {
          debug: (message: string, context?: Record<string, unknown>) => {
            logger.debug(`${message}${context ? ' ' + JSON.stringify(context) : ''}`);
          },
          info: (message: string, context?: Record<string, unknown>) => {
            logger.log(`${message}${context ? ' ' + JSON.stringify(context) : ''}`);
          },
          warn: (message: string, context?: Record<string, unknown>) => {
            logger.warn(`${message}${context ? ' ' + JSON.stringify(context) : ''}`);
          },
          error: (message: string, error?: Error, context?: Record<string, unknown>) => {
            logger.error(
              `${message}${context ? ' ' + JSON.stringify(context) : ''}`,
              error?.stack
            );
          },
          fatal: (message: string, error?: Error, context?: Record<string, unknown>) => {
            logger.error(
              `FATAL: ${message}${context ? ' ' + JSON.stringify(context) : ''}`,
              error?.stack
            );
          }
        };
      }
    },

    // Repositories
    {
      provide: 'IUserRepository',
      useClass: UserRepository
    },
    {
      provide: 'IOrganizationRepository',
      useClass: OrganizationRepository
    },
    {
      provide: 'ISessionRepository',
      useClass: SessionRepository
    },

    // Services
    {
      provide: 'IPasswordService',
      useClass: PasswordService
    },
    {
      provide: 'ITokenService',
      useClass: TokenService
    },
    {
      provide: 'ISessionService',
      useClass: SessionService
    },
    {
      provide: 'INotificationService',
      useClass: NotificationService
    },

    // External Clients
    {
      provide: 'IBumClient',
      useClass: BumClient
    },

    // Command & Query Handlers
    ...commandHandlers,
    ...queryHandlers
  ],
  exports: [
    'ILogger',
    'IUserRepository',
    'IOrganizationRepository',
    'ISessionRepository',
    'IPasswordService',
    'ITokenService',
    'ISessionService',
    'INotificationService',
    'IBumClient'
  ]
})
export class IamModule {}
