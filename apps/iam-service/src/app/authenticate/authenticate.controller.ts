import { Body, Controller, Post, HttpCode, HttpStatus, Headers, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthIdentifyDTO, AuthIdentifyResponseDTO, AuthRequestOtpDTO, AuthSignInDTO, AuthSignInResponseDto } from './authenticate.dtos';
import { ErrorResponseDTO, SucessResponseDto } from '@ecoma/nestjs';
import { AuthenticateService } from './authenticate.service';
import { Request } from 'express';

@Controller('authenticate')
@ApiTags('Authenticate')
export class AuthenticateController {
  constructor(private authService: AuthenticateService) {}

  /**
   * @summary Get basic user identification information
   * @param authIdentifyDTO - Data transfer object for OTP request
   * @returns A response object about basic user identification information
   */
  @Post('identify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get basic user identification information' })
  @ApiBody({ type: AuthIdentifyDTO })
  @ApiResponse({ status: HttpStatus.OK, description: 'Basic user identification information', type: AuthIdentifyResponseDTO })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'A technical error occurred on the server side.', type: ErrorResponseDTO })
  public identify(@Body() authIdentifyDTO: AuthIdentifyDTO): Promise<AuthIdentifyResponseDTO> {
    return this.authService.identify(authIdentifyDTO);
  }

  /**
   * @summary Request one-time password
   * @param requestOtpDTO - Data transfer object for OTP request
   * @returns A response object indicating the status of the OTP request.
   */
  @Post('request-otp')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request one-time password' })
  @ApiBody({ type: AuthRequestOtpDTO })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'One-time password sent successfully', type: SucessResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The request data is malformed', type: ErrorResponseDTO })
  @ApiResponse({ status: HttpStatus.TOO_MANY_REQUESTS, description: 'Request too fast', type: ErrorResponseDTO })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid input data', type: ErrorResponseDTO })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'A technical error occurred on the server side.', type: ErrorResponseDTO })
  public requestOTP(@Body() requestOtpDTO: AuthRequestOtpDTO): Promise<SucessResponseDto> {
    return this.authService.requestOTP(requestOtpDTO);
  }

  /**
   * @summary User login
   * @param signInDTO - Data transfer object for sign in
   * @param headers - All headers from the request
   * @returns A response object indicating the status of the login attempt.
   */
  @Post('sign-in')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: AuthSignInDTO })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Login successful', type: AuthSignInResponseDto })
  @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Invalid input data', type: ErrorResponseDTO })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'A technical error occurred on the server side.', type: ErrorResponseDTO })
  public signIn(@Body() signInDTO: AuthSignInDTO, @Headers() headers: Record<string, string>): Promise<AuthSignInResponseDto> {
    return this.authService.signIn(signInDTO, headers);
  }

  /**
   * @summary User logout
   * @param req - The request object containing cookies
   * @returns A response object indicating the status of the logout attempt.
   */
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Logout successful', type: SucessResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'A technical error occurred on the server side.' })
  public logout(@Req() req: Request) {
    return this.authService.signOut(req);
  }
}
