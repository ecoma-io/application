import { Body, Controller, Post, HttpCode, HttpStatus, Headers } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthRequestOtpDTO, AuthSignInDTO, AuthSignInResponseDto } from "./auth.dtos";
import { ErrorResponseDetailsDTO, ErrorResponseDTO, SucessResponseDto } from "@ecoma/dtos";

@Controller("auth")
@ApiTags('Auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  /**
   * @summary Request one-time password
   * @param requestOtpDTO - Data transfer object for OTP request
   * @returns A response object indicating the status of the OTP request.
   */
  @Post('requestOtp')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request one-time password' })
  @ApiBody({ type: AuthRequestOtpDTO })
  @ApiResponse({ status: 201, description: 'One-time password sent successfully', type: SucessResponseDto })
  @ApiResponse({ status: 400, description: 'The request data is malformed', type: ErrorResponseDTO })
  @ApiResponse({ status: 429, description: 'Request too fast', type: ErrorResponseDTO })
  @ApiResponse({ status: 422, description: 'Invalid input data', type: ErrorResponseDetailsDTO })
  public requestOTP(@Body() requestOtpDTO: AuthRequestOtpDTO): Promise<SucessResponseDto> {
    return this.authService.requestOTP(requestOtpDTO);
  }

  /**
   * @summary User login
   * @param signInDTO - Data transfer object for sign in
   * @param headers - All headers from the request
   * @returns A response object indicating the status of the login attempt.
   */
  @Post('login')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: AuthSignInDTO })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthSignInResponseDto })
  @ApiResponse({ status: 401, description: 'OTP code is invalid' })
  @ApiResponse({ status: 422, description: 'Invalid input data' })
  public signIn(@Body() signInDTO: AuthSignInDTO, @Headers() headers: Record<string, string>): Promise<AuthSignInResponseDto> {
    return this.authService.signIn(signInDTO, headers);
  }

  /**
   * @summary User logout
   * @returns A response object indicating the status of the logout attempt.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful', type: SucessResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public logout() {
    return this.authService.signOut();
  }

}
