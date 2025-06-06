import { registerConfig } from '@ecoma/nestjs';
import { IsString, IsOptional } from 'class-validator';

export class SmtpEnvironmentVariables {
  @IsString()
  SMTP_URI!: string;

  @IsString()
  @IsOptional()
  SMTP_RETRY_ATTEMPTS?: string;

  @IsString()
  @IsOptional()
  SMTP_RETRY_DELAY?: string;
}

export class SmtpConfig {
  uri: string;
  retryAttempts: number;
  retryDelay: number;
}

export const smtpConfig = registerConfig<SmtpEnvironmentVariables, SmtpConfig>(
  'smtp',
  SmtpEnvironmentVariables,
  undefined,
  (env) => ({
    uri: env.SMTP_URI,
    retryAttempts: Number(env.SMTP_RETRY_ATTEMPTS) || 10,
    retryDelay: Number(env.SMTP_RETRY_DELAY) || 5000,
  })
);
