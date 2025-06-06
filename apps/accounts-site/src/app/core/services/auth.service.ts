import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Domains } from '@ecoma/angular';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private domains: Domains) {}

  private readonly ACCESS_TOKEN_KEY = 'token';

  identify(payload: any): Observable<any> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/identify`;
    return this.http.post<any>(url, payload).pipe();
  }

  requestOTP(email: string): Observable<any> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/request-otp`;
    return this.http.post<any>(url, { email }).pipe();
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    const url = `${this.domains.getIamServiceBaseUrl()}/authenticate/login`;
    return this.http.post<any>(url, { email, otp: otp.toString() }).pipe(
      tap((response) => {
        this.setToken(response.data.token);
      })
    );
  }

  logout(): Observable<any> {
    sessionStorage.clear();
    return of(true);
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY) !== null;
  }

  private setToken(token: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }
}
