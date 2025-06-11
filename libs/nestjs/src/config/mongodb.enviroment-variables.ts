import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class MongodbEnvironmentVariables {
  @IsString()
  @Matches(/^mongodb(\+srv)?:\/\//, {
    message: 'MONGODB_URI must be a valid MongoDB connection string starting with mongodb:// or mongodb+srv://',
  })
  @IsNotEmpty()
  MONGODB_URI!: string;
}
