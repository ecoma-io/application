import { AppEnvironmentVariables, registerConfig } from "@ecoma/nestjs-config";


export class ApplicationConfig {
  port: number;
}


export const appConfig = registerConfig<AppEnvironmentVariables, ApplicationConfig>('app', AppEnvironmentVariables, { PORT: '3001' }, (enviroments) => {
  return { port: enviroments.PORT }
});