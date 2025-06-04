export class OtpNotificationMessageDto {
  template: string; // 'otp'
  data: {
    userId: string;
    email: string;
    otp: string;
    firstName?: string;
    expireMinutes?: number;
  };
}
