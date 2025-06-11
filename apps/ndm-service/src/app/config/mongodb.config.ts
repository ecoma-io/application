import { MongodbEnvironmentVariables, registerConfig } from "@ecoma/nestjs";
import { MongooseModuleOptions } from "@nestjs/mongoose";

export class MongodbConfig implements MongooseModuleOptions { }

export const mongodbConfig = registerConfig<MongodbEnvironmentVariables, MongodbConfig>('mongodb', MongodbEnvironmentVariables, undefined, (enviroments) => {
  return {
    uri: enviroments.MONGODB_URI,
    dbName: 'ndm',
  }
});
