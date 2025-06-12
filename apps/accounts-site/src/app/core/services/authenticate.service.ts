import { Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cookies, Domains } from '@ecoma/angular';
import { Router } from '@angular/router';

export interface IAuththenticateIdentifyPayload {
  email: string;
}

export interface IAuthenticateIdentifyResponse {
  data?: {
    firstName?: string;
    lastName?: string;
  };
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

export interface IAuthenticateSignInResponseData {
  token: string;
  email: string;
  id: string;
  firstName: string;
  lastName?: string;
}

export interface IAuthenticateSignInResponse {
  data: IAuthenticateSignInResponseData;
}

@Injectable({ providedIn: 'root' })
export class AuthenticateService {

  private cookieDomain: string;

  constructor(private http: HttpClient, private domains: Domains, private cookie: Cookies, private router: Router) {
    this.cookieDomain = '.' + this.domains.getRootDomain();
  }

  private readonly CURRENT_USER_KEY = 'USER';
  private readonly CURRENT_ACCESS_TOKEN_KEY = 'TOKEN';

  identify(payload: IAuththenticateIdentifyPayload): Observable<IAuthenticateIdentifyResponse> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/identify`;
    return this.http.post<IAuthenticateIdentifyResponse>(url, payload).pipe();
  }

  requestOTP(payload: IAuththenticateRequestOtpPayload): Observable<unknown> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/request-otp`;
    return this.http.post<unknown>(url, payload).pipe();
  }

  signIn(payload: IAuththenticateSignInPayload): Observable<IAuthenticateSignInResponse> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/sign-in`;
    return this.http.post<IAuthenticateSignInResponse>(url, payload).pipe(
      tap((response) => {
        const { token, ...userInfo } = response.data;
        this.setAccessToken(token);
        this.setCurrentUserInfo(userInfo);
      })
    );
  }

  signOut(): Observable<unknown> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/sign-out`;
    return this.http.post<unknown>(url, {}, { withCredentials: true }).pipe(
      finalize(() => {
        // Clear cookies and session storage regardless of success or failure
        this.cookie.delete(this.CURRENT_USER_KEY, '/', this.cookieDomain);
        this.cookie.delete(this.CURRENT_ACCESS_TOKEN_KEY, '/', this.cookieDomain);
        sessionStorage.clear();
        this.router.navigateByUrl('/authenticate/identification');
      })
    );
  }

  isAuthenticated(): boolean {
    return this.cookie.check(this.CURRENT_USER_KEY);
  }

  getCurrentUserInfo(): IAuthenticateSignInResponse['data'] | undefined {
    const currentUserInfoCookie = this.cookie.get(this.CURRENT_USER_KEY);
    if (currentUserInfoCookie) {
      return JSON.parse(currentUserInfoCookie);
    } else {
      return undefined;
    }
  }

  private setAccessToken(token: string): void {
    this.cookie.set(this.CURRENT_ACCESS_TOKEN_KEY, token, {
      path: '/',
      domain: this.cookieDomain,
      expires: -1
    });
  }

  private setCurrentUserInfo(userInfo: Omit<IAuthenticateSignInResponseData, 'token'>): void {
    this.cookie.set(this.CURRENT_USER_KEY, JSON.stringify(userInfo), {
      path: '/',
      domain: this.cookieDomain,
      expires: -1
    });
  }
}
