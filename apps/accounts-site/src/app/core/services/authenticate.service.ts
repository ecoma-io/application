import { Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppAuthenticateService, Domains } from '@ecoma/angular';
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


  constructor(private http: HttpClient, private domains: Domains, private router: Router, private appAuthenticateService: AppAuthenticateService) {
  }

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
        this.appAuthenticateService.setAccessToken(token);
        this.appAuthenticateService.setCurrentUserInfo(userInfo);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.appAuthenticateService.isAuthenticated();
  }

  signOut(): Observable<unknown> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/sign-out`;
    return this.http.post<unknown>(url, {}, { withCredentials: true }).pipe(
      finalize(() => {
        this.appAuthenticateService.signOut();
        sessionStorage.clear();
        this.router.navigateByUrl('/authenticate/identification');
      })
    );
  }


}
