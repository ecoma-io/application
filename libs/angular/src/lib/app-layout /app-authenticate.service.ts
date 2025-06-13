import { Injectable } from '@angular/core';
import { Cookies } from '../cookies';
import { Domains } from '../domains';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ICurrentUserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
}


@Injectable({ providedIn: 'root' })
export class AppAuthenticateService {

  private tokenSubject: BehaviorSubject<string | undefined>;
  private userInfoSubject: BehaviorSubject<ICurrentUserInfo | undefined>;
  private cookieDomain: string;

  constructor(
    private domains: Domains,
    private cookie: Cookies,
  ) {
    this.cookieDomain = '.' + this.domains.getRootDomain();
    const currentTokenCookie = this.cookie.get(this.CURRENT_ACCESS_TOKEN_KEY);
    this.tokenSubject = new BehaviorSubject(currentTokenCookie ?? undefined);
    const currentUserInfoCookie = this.cookie.get(this.CURRENT_USER_KEY);
    this.userInfoSubject = new BehaviorSubject(currentUserInfoCookie ? JSON.parse(currentUserInfoCookie) : undefined);
  }

  private readonly CURRENT_USER_KEY = 'USER';
  private readonly CURRENT_ACCESS_TOKEN_KEY = 'TOKEN';

  public isAuthenticated(): boolean {
    return this.tokenSubject.value ? true : false
  }

  public getAccessToken(): Observable<string | undefined> {
    return this.tokenSubject.asObservable();
  }

  public setAccessToken(token: string): void {
    this.cookie.set(this.CURRENT_ACCESS_TOKEN_KEY, token, {
      path: '/',
      domain: this.cookieDomain,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 28 * 86400 * 1000)
    });
    this.tokenSubject.next(token);
  }

  public getUserInfo(): Observable<ICurrentUserInfo | undefined> {
    return this.userInfoSubject.asObservable();
  }

  public setCurrentUserInfo(userInfo: Omit<ICurrentUserInfo, 'token'>): void {
    this.cookie.set(this.CURRENT_USER_KEY, JSON.stringify(userInfo), {
      path: '/',
      domain: this.cookieDomain,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 28 * 86400 * 1000)
    });
    this.userInfoSubject.next(userInfo);
  }

  public signOut() {
    this.cookie.delete(this.CURRENT_USER_KEY, '/', this.cookieDomain);
    this.tokenSubject.next(undefined);
    this.cookie.delete(this.CURRENT_ACCESS_TOKEN_KEY, '/', this.cookieDomain);
    this.userInfoSubject.next(undefined);
  }

}
