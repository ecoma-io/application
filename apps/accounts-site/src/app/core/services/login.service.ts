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
    return this.http.post<SucessResponseDto>(`${this.domains.getIamServiceBaseUrl()}/auth/requestOtp`, { email })
      .pipe()
  }

  verifyOTP(email: string, otp: string): Observable<SucessResponseDto> {
    return this.http.post<SucessResponseDto>(`${this.domains.getIamServiceBaseUrl()}/auth/login`, { email, otp })
      .pipe()
  }
}
