import { ErrorResponseDTO } from "@ecoma/nestjs";
import { HttpException, HttpStatus } from "@nestjs/common";


export class TooMananyRequestOtpException extends HttpException {

  constructor() {
    const response: ErrorResponseDTO = {
      message: 'You are requesting to send otp too quickly. Please try again later!'
    }
    super(response, HttpStatus.TOO_MANY_REQUESTS);
  }

}

export class InvalidOrExpiredOtpException extends HttpException {
  constructor() {
    const response: ErrorResponseDTO<Record<string, string>> = {
      details: {
        'otp': 'OTP is invalid or expired.'
      }
    }
    super(response, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}


export class SignInBadRequestException extends HttpException {

  constructor(message: string) {
    super({ message }, HttpStatus.BAD_REQUEST);
  }

}
