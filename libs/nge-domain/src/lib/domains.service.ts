import { Injectable, Inject, PLATFORM_ID, EnvironmentProviders, InjectionToken, makeEnvironmentProviders, Optional } from '@angular/core';
import { isPlatformServer, DOCUMENT } from '@angular/common';
import { Request } from 'express';

/**
 * Injection token for providing the Express Request object in server-side environment
 */
export const REQUEST_TOKEN: InjectionToken<Request> = new InjectionToken<Request>('REQUEST_TOKEN');

/**
 * Provides environment configuration for the Domains service
 * @param request - The Express Request object to be used in server-side environment
 * @returns Environment providers configuration
 */
export const provideSsrDomain = (request: Request): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: REQUEST_TOKEN,
      useValue: request,
    },
  ]);
};

/**
 * Service for managing domain-related operations and URL generation
 * Handles both browser and server-side environments
 */
@Injectable({
  providedIn: 'root',
})
export class Domains {
  private protocol: string;
  private rootDomain: string;

  /**
   * Creates an instance of Domains service
   * @param platformId - The platform ID to determine execution environment
   * @param document - The document object for browser environment
   * @param request - Optional Express Request object for server environment
   * @throws Error if REQUEST_TOKEN is not provided in server-side environment
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document,
    @Optional() @Inject(REQUEST_TOKEN) private request: Request
  ) {
    if (isPlatformServer(this.platformId)) {
      if (this.request) {
        this.protocol = this.request.protocol;
        this.rootDomain = this.extractRootDomain(this.request.hostname);
      } else {
        throw new Error('Domains service requires a REQUEST_TOKEN to be provided in server-side environment. using provideSsrDomain');
      }
    } else {
      this.protocol = this.document.location.protocol;
      this.rootDomain = this.extractRootDomain(this.document.location.hostname);
    }
  }

  /**
   * Gets the current protocol
   * @returns The current protocol (e.g., 'https:', 'http:')
   */
  getProtocol(): string | undefined {
    return this.protocol;
  }

  /**
   * Gets the root domain from the current hostname
   * @returns The root domain (e.g., 'example.com' from 'www.example.com')
   * @example
   * // Returns 'example.com'
   * getRootDomain('www.example.com')
   * // Returns 'co.uk'
   * getRootDomain('sub.domain.co.uk')
   */
  getRootDomain(): string {
    return this.rootDomain;
  }

  /**
   * Gets the base URL for the home site
   * @returns The complete home site URL (e.g., 'https://example.com')
   */
  getHomeSiteBaseUrl(): string {
    return `${this.protocol}//${this.getRootDomain()}`;
  }

  /**
   * Gets the base URL for the accounts site
   * @returns The complete accounts site URL (e.g., 'https://accounts.example.com')
   */
  getAccountsSiteBaseUrl(): string {
    return `${this.protocol}//accounts.${this.getRootDomain()}`;
  }

  /**
   * Gets the base URL for the admin site
   * @returns The complete admin site URL (e.g., 'https://admin.example.com')
   */
  getAdminSiteBaseUrl(): string {
    return `${this.protocol}//admin.${this.getRootDomain()}`;
  }

  /**
   * Gets the base URL for the icons
   * @returns The complete admin site URL (e.g., 'https://icons.example.com')
   */
  getIconsBaseUrl(): string {
    return `${this.protocol}//icons.${this.getRootDomain()}`;
  }

  /**
   * Extracts the root domain from a hostname
   * @param hostname - The hostname to extract from (e.g., 'www.example.com')
   * @returns The root domain (e.g., 'example.com')
   * @private
   */
  private extractRootDomain(hostname: string): string {
    if (!hostname || hostname == '') {
      throw Error('Hostname should be defined and not empty!');
    }
    const parts = hostname.split('.');
    return parts.slice(-2).join('.');
  }
}
