import { SucessResponseDto } from '@ecoma/dtos';
import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Domains } from '@ecoma/nge-domain';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private domains: Domains, @Inject(WA_LOCAL_STORAGE) private localStorage: Storage) {}

  private readonly ACCESS_TOKEN_KEY = 'token';

  requestOTP(email: string): Observable<SucessResponseDto> {
    const url = `${this.domains.getIamServiceBaseUrl()}/auth/requestOtp`;
    return this.http.post<SucessResponseDto>(url, { email }).pipe();
  }

  verifyOTP(email: string, otp: string): Observable<SucessResponseDto> {
    const url = `${this.domains.getIamServiceBaseUrl()}/auth/login`;
    return this.http.post<SucessResponseDto>(url, { email, otp }).pipe(
      tap((response) => {
        this.setToken((response as any).data.token);
      })
    );
  }

  logout(): void {
    this.localStorage.clear();
    //TODO: call api for logout
  }

  isAuthenticated(): boolean {
    return this.localStorage.getItem(this.ACCESS_TOKEN_KEY) !== null;
  }

  private setToken(token: string): void {
    this.localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }
}
