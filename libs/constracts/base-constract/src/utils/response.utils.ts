import { StandardResponse } from "../interfaces/standard-response.interface";

export function successResponse<T>(data?: T): StandardResponse<T> {
  return { success: true, data };
}

export function errorResponse<T>(
  code: string,
  message: string,
  details?: T
): StandardResponse<T> {
  return {
    success: false,
    error: { code, message, details },
  };
}
