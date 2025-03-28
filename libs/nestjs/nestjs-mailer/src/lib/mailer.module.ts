import { DynamicModule, Module } from "@nestjs/common";
import { MAILER_CONFIG } from "./mailer.constants";
import { MailerModuleOptions } from "./mailer.options";
import { MailerService } from "./mailer.service";

@Module({})
export class MailerModule {
  static register(options: MailerModuleOptions): DynamicModule {
    return {
      module: MailerModule,
      global: true,
      providers: [
        {
          provide: MAILER_CONFIG,
          useValue: options,
        },
        MailerService,
      ],
      exports: [MailerService],
    };
  }
}
