import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { registerAs, ConfigObject } from '@nestjs/config';

export function registerConfig<TEnviromentObject, TConfig extends ConfigObject>(
  token: string,
  envClss: ClassConstructor<TEnviromentObject>,
  defaults: { [key: string]: string } | undefined,
  callback: (enviroments: TEnviromentObject) => TConfig
) {
  // Tạo một bản sao của process.env để gán giá trị mặc định nếu có
  const envWithDefaults = { ...process.env, ...(defaults ?? {}) };

  const validatedConfig = plainToInstance(envClss, envWithDefaults, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig as object, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return registerAs(token, () => callback(validatedConfig));
}
