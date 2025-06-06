import { ITypedocExecutorSchema } from '../schema';

export const toArguments = (options: ITypedocExecutorSchema): string[] =>
  Object.entries(options)
    .filter(([, value]) => !!value)
    .reduce((args, [key, value]) => {
      let arg = `--${key}`;
      if (typeof value !== 'boolean') arg += ` ${value}`;
      return [...args, arg];
    }, []);
