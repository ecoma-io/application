import { IsString, IsNotEmpty } from 'class-validator';

export class ActivateRetentionPolicyCommandDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}
