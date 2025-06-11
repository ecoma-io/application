import { SucessResponseDto } from '@ecoma/nestjs';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

export class AuthIdentifyDTO {
  @ApiProperty({ required: true, description: 'Email for request otp' })
  @Matches(/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, {
    message: 'email should be in valid standard email format',
  })
  @IsNotEmpty()
  email!: string;
}

export class AuthIdentifyResponseData {
  @ApiProperty({ description: 'User first name' })
  firstName?: string;
  @ApiProperty({ description: 'User last name' })
  lastName?: string;
}

export class AuthIdentifyResponseDTO extends SucessResponseDto<AuthIdentifyResponseData> { }

export class AuthRequestOtpDTO {
  @ApiProperty({ required: true, description: 'Email for request otp' })
  @Matches(/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, {
    message: 'email should be in valid standard email format',
  })
  @IsNotEmpty()
  email!: string;
}

export class AuthSignInDTO {

  @ApiProperty({ description: 'User first name' })
  @MaxLength(18)
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'User last name' })
  @MaxLength(18)
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: true, description: 'Email for sign in' })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, {
    message: 'email should be in valid standard email format',
  })
  email!: string;

  @ApiProperty({ required: true, description: 'OTP code for sign-in' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP code should be 6 digits number' })
  otp!: string;
}

export class AuthSignInResponseData {
  @ApiProperty({ required: true, description: 'Access token' })
  token!: string;

  @ApiProperty({ required: true, description: 'User id' })
  id!: string;

  @ApiProperty({ required: true, description: 'User email' })
  email!: string;

  @ApiProperty({ required: true, description: 'User first name' })
  firstName!: string;

  @ApiProperty({ required: true, description: 'User last name' })
  lastName?: string;
}

export class AuthSignInResponseDto extends SucessResponseDto<AuthSignInResponseData> { }