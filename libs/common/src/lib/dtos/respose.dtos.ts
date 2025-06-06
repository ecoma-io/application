import { Expose } from 'class-transformer';

export class ResponseDTO {
  @Expose()
  success!: boolean;
}

export class ErrorResponseDetail {
  [key: string]: string;
}

export class ErrorResponseDTO extends ResponseDTO {
  @Expose()
  override success = false;

  @Expose()
  message?: string;
}

export class ErrorResponseDetailsDTO extends ErrorResponseDTO {
  @Expose()
  details!: ErrorResponseDetail;
}

export class SucessResponseDto extends ResponseDTO {
  @Expose()
  override success = true;

  @Expose()
  message?: string;
}

export abstract class BaseSucessResponseDataDTO<T> extends SucessResponseDto {
  data!: T;
}

export abstract class BaseSucessResponseDatasDTO<T> extends SucessResponseDto {
  @Expose()
  data!: Array<T>;
}
