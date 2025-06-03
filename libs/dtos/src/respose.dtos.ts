
export class ResponseDTO {
  success!: boolean;
}

export class ErrorResponseDetail {
  [key: string]: string;
}

export class ErrorResponseDTO extends ResponseDTO {
  override success = false;
  message?: string;
}

export class ErrorResponseDetailsDTO extends ErrorResponseDTO {
  details!: ErrorResponseDetail;
}

export class SucessResponseDto extends ResponseDTO {
  override success = true;
  message?: string;
}

export class SucessResponseDataDTO<T> extends SucessResponseDto {
  data!: T
}

export class SucessResponseDatasDTO<T> extends SucessResponseDto {
  data!: Array<T>
}
