export interface IUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  locale: string;
  status: string; // e.g., UserStatusValues
  // Avoid exposing sensitive or internal details
}

export interface ILoginSuccessDto {
    userId: string;
    accessToken: string; // Or session token
    // refreshToken?: string;
    expiresIn: number; // seconds
}
