import { DynamicModule, Module } from '@nestjs/common';
import SMTPPool from 'nodemailer/lib/smtp-pool';
import { MailerService } from './mailer.service';

@Module({})
export class MailerModule {

  public static register(smtpUri?: string): DynamicModule {
    const configs: SMTPPool.Options = {
      pool: true,
      url: smtpUri
    };

    return {
      module: MailerModule,
      global: true,
      providers: [
        {
          provide: MailerService,
          useValue: new MailerService(configs),
        },
      ],
      exports: [MailerService],
    };
  }

  private static parseSearchParams(searchParams: URLSearchParams): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}
