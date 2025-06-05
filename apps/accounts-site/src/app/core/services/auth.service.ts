import { AuthIdentifyDTO, AuthIdentifyResponseDTO, AuthSignInResponseDto } from '@ecoma/iam-service-dtos';
import { SucessResponseDto } from '@ecoma/dtos';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Domains } from '@ecoma/nge-domain';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private domains: Domains, @Inject(WA_LOCAL_STORAGE) private localStorage: Storage) { }

  private readonly ACCESS_TOKEN_KEY = 'token';

  identify(payload: AuthIdentifyDTO): Observable<AuthIdentifyResponseDTO> {
    const url = `${this.domains.getIamServiceBaseUrl()}/auth/identify`;
    return this.http
      .post<AuthIdentifyResponseDTO>(url, payload)
      .pipe();
  }

  requestOTP(email: string): Observable<SucessResponseDto> {
    const url = `${this.domains.getIamServiceBaseUrl()}/auth/requestOtp`;
    return this.http.post<SucessResponseDto>(url, { email }).pipe();
  }

  verifyOTP(email: string, otp: string): Observable<AuthSignInResponseDto> {
    const url = `${this.domains.getIamServiceBaseUrl()}/auth/login`;
    return this.http.post<AuthSignInResponseDto>(url, { email, otp }).pipe(
      tap((response) => {
        this.setToken(response.data.token);
      })
    );
  }

  logout(): Observable<any> {
    this.localStorage.clear();
    return of(true);
  }

  isAuthenticated(): boolean {
    return this.localStorage.getItem(this.ACCESS_TOKEN_KEY) !== null;
  }

  private setToken(token: string): void {
    this.localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }


}
