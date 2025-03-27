import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteRetentionPolicyCommandDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}
