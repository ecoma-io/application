import { IsString, IsNotEmpty } from 'class-validator';

export class DeactivateRetentionPolicyCommandDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}
