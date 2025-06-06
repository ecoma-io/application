import { IsNumber, Max, Min } from 'class-validator';

export class AppEnvironmentVariables {
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT!: number;
}
