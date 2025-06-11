export class OtpNotificationMessageDto {
  userId: string;
  email: string;
  otp: string;
  firstName?: string;
  expireMinutes?: number;
}
