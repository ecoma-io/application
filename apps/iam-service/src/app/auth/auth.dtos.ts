import { BaseSucessResponseDataDTO, ResponseDTO } from '@ecoma/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';


export class AuthRequestOtpDTO {

  @ApiProperty({ required: true, description: 'Email for request otp' })
  @Matches(/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, { message: 'email should be in valid standard email format' })
  @IsNotEmpty()
  email: string;
}




export class AuthSignInDTO {

  @ApiProperty({ required: true, description: 'Email for sign in' })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9.!#$%&'*+=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, { message: 'email should be in valid standard email format' })
  email: string;

  @ApiProperty({ required: true, description: 'OTP code for sign-in' })
  @IsString()
  @Length(6)
  otpCode: string; // Made optional for the requestOTP use case
}


export class AuthSignInResponseData {
  @ApiProperty({ required: true, description: 'Access token' })
  token: string;

  @ApiProperty({ required: true, description: 'User id' })
  id: string;

  @ApiProperty({ required: true, description: 'User email' })
  email: string;

  @ApiProperty({ required: true, description: 'User first name' })
  firstName: string;

  @ApiProperty({ required: true, description: 'User last name' })
  lastName: string;
}

export class AuthSignInResponseDto extends BaseSucessResponseDataDTO<AuthSignInResponseData> {

}
