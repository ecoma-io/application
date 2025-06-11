import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Domains } from '@ecoma/angular';


export interface IAuththenticateIdentifyPayload {
  email: string;
}

export interface IAuthenticateIdentifyResponse {
  data?: {
    firstName?: string;
    lastName?: string;
  }
}

export interface IAuththenticateRequestOtpPayload {
  email: string;
}

export interface IAuththenticateSignInPayload {
  email: string;
  otp: string;
  fisrtName?: string;
  lastName?: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private domains: Domains) {
  }

  private readonly ACCESS_TOKEN_KEY = 'token';

  identify(payload: IAuththenticateIdentifyPayload): Observable<IAuthenticateIdentifyResponse> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/identify`;
    return this.http.post<IAuthenticateIdentifyResponse>(url, payload).pipe();
  }

  requestOTP(payload: IAuththenticateRequestOtpPayload): Observable<unknown> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/request-otp`;
    return this.http.post<unknown>(url, payload).pipe();
  }

  signIn(payload: IAuththenticateSignInPayload): Observable<any> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/sign-in`;
    return this.http.post<any>(url, payload).pipe(
      tap((response) => {
        this.setToken(response.data.token);
      })
    );
  }

  signOut(): Observable<unknown> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/sign-out`;
    sessionStorage.clear();
    return this.http.post<unknown>(url, {}).pipe();
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY) !== null;
  }

  private setToken(token: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }
}
