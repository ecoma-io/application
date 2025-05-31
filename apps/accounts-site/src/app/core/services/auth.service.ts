import { Domains } from '@ecoma/nge-domain';
import { Cookies } from '@ecoma/nge-cookie';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface IUserBasicInfo {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'tk';
  private readonly BASIC_USERINFO = 'ui';

  constructor(private cookies: Cookies, private domain: Domains) {}

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
      this.setToken(mockResponse.token);
      this.setBasicUserInfo(mockResponse.user);
      return of(mockResponse).pipe(delay(1000));
    }
    return throwError(() => new Error('Invalid verification code'));
  }

  logout(): void {
    this.cookies.deleteAll('/', this.domain.getRootDomain());
  }

  isAuthenticated(): boolean {
    return this.cookies.check(this.ACCESS_TOKEN_KEY);
  }

  private setToken(token: string): void {
    this.cookies.set(this.ACCESS_TOKEN_KEY, token, {
      domain: this.domain.getRootDomain(),
    });
  }

  private setBasicUserInfo(userInfo: IUserBasicInfo): void {
    this.cookies.set(this.BASIC_USERINFO, JSON.stringify(userInfo), {
      domain: this.domain.getRootDomain(),
    });
  }
}
