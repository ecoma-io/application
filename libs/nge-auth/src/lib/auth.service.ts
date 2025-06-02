import { Domains } from '@ecoma/nge-domain';
import { Cookies } from '@ecoma/nge-cookie';
import { Injectable } from '@angular/core';

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
  private readonly ACCESS_TOKEN_KEY = 'ACTK';

  constructor(private cookies: Cookies, private domain: Domains) {}

  logout(): void {
    this.cookies.deleteAll('/', this.domain.getRootDomain());
  }

  isAuthenticated(): boolean {
    return this.cookies.check(this.ACCESS_TOKEN_KEY);
  }

  setToken(token: string): void {
    this.cookies.set(this.ACCESS_TOKEN_KEY, token, {
      domain: this.domain.getRootDomain(),
    });
  }
}
