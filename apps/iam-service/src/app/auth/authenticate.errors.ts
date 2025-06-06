import { ErrorResponseDTO } from "@ecoma/dtos";
import { HttpException, HttpStatus } from "@nestjs/common";


export class TooMananyRequestOtpException extends HttpException {

  constructor() {
    const response: ErrorResponseDTO = {
      success: false,
      message: 'You are requesting to send otp too quickly. Please try again later!'
    }
    super(response, HttpStatus.TOO_MANY_REQUESTS);
  }

}

export class UserNotFoundException extends HttpException {
  constructor() {
    const response: ErrorResponseDTO = {
      success: false,
      message: 'User not found.'
    }
    super(response, HttpStatus.NOT_FOUND);
  }
}

export class InvalidOrExpiredOtpException extends HttpException {
  constructor() {
    const response: ErrorResponseDTO = {
      success: false,
      message: 'OTP is invalid or expired.'
    }
    super(response, HttpStatus.UNAUTHORIZED);
  }
}
