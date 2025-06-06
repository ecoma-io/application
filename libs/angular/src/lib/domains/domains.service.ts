import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformServer, DOCUMENT } from '@angular/common';
import { Request } from 'express';

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
    @Optional() @Inject('REQUEST') private request: Request
  ) {
    if (isPlatformServer(this.platformId)) {
      if (this.request) {
        if (this.request.headers['x-forwarded-proto']) {
          const protocol =
            typeof this.request.headers['x-forwarded-proto'] === 'string'
              ? this.request.headers['x-forwarded-proto']
              : this.request.headers['x-forwarded-proto'][0];
          this.protocol = protocol.split(',')[0] + ':';
        } else {
          this.protocol = this.request.protocol;
        }
        if (this.request.headers['x-forwarded-host']) {
          const hostname: string =
            typeof this.request.headers['x-forwarded-host'] === 'string'
              ? this.request.headers['x-forwarded-host']
              : this.request.headers['x-forwarded-host'][0];
          this.rootDomain = this.extractRootDomain(hostname);
        } else {
          this.rootDomain = this.extractRootDomain(this.request.hostname);
        }
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
   * Gets the base URL for the IAM service
   * @returns The complete IAM service URL (e.g., 'https://iam.example.com')
   */
  getIamServiceBaseUrl(): string {
    return `${this.protocol}//iam.${this.getRootDomain()}`;
  }

  /**
   * Gets the base URL for the NDM service
   * @returns The complete NDM service URL (e.g., 'https://ndm.example.com')
   */
  getNdmServiceBaseUrl(): string {
    return `${this.protocol}//ndm.${this.getRootDomain()}`;
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
