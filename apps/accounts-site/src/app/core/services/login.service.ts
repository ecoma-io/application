import { SucessResponseDto } from '@ecoma/dtos';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Domains } from '@ecoma/nge-domain';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private domains: Domains,
  ) { }

  requestOTP(email: string): Observable<SucessResponseDto> {
    const url = `${this.domains.getIamServiceBaseUrl()}/auth/requestOtp`;
    return this.http
      .post<SucessResponseDto>(url, { email })
      .pipe()
  }

  verifyOTP(email: string, otp: string): Observable<SucessResponseDto> {
    const url = `${this.domains.getIamServiceBaseUrl()}/auth/login`;
    return this.http
      .post<SucessResponseDto>(url, { email, otp })
      .pipe()
  }
}
