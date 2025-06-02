import { AuthService } from '@ecoma/nge-auth';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private auth: AuthService) {}

  requestOTP(email: string): Observable<any> {
    // Mock API response for OTP request
    if (email.includes('@')) {
      return of({ success: true, message: 'Verification code sent successfully' }).pipe(delay(1000));
    }
    return throwError(() => new Error('Invalid email address'));
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    // Mock API response for OTP verification
    if (otp === '123456') {
      // For testing purposes
      const mockResponse = {
        token: 'mock_jwt_token',
        user: {
          id: '1',
          email,
          firstName: 'John',
          lastName: 'Doe',
        },
      };
      this.auth.setToken(mockResponse.token);
      return of(mockResponse).pipe(delay(1000));
    }
    return throwError(() => new Error('Invalid verification code'));
  }
}
