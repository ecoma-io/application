import { Expose } from 'class-transformer';




export class ErrorResponseDTO<TDetails = undefined> {
  @Expose()
  message?: string;

  @Expose()
  details?: TDetails;
}


export class SucessResponseDto<TData = undefined, TMetadata = undefined> {
  @Expose()
  message?: string;

  @Expose()
  data?: TData;

  @Expose()
  metadata?: TMetadata;
}

