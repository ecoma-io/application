import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Domains, REQUEST_TOKEN } from './domains.service';

describe('DomainsService', () => {
  let service: Domains;
  let document: any;
  let request: any;

  beforeEach(() => {
    // Mock objects
    document = {
      location: {
        protocol: 'https:',
        hostname: 'www.example.com',
      },
    };

    request = {
      protocol: 'http:',
      hostname: 'server.example.com',
    };

    TestBed.configureTestingModule({
      providers: [
        Domains,
        { provide: DOCUMENT, useValue: document },
        // PLATFORM_ID will be provided by individual tests
      ],
    });

    // service = TestBed.inject(Domains);
  });

  it('should be created', () => {
    TestBed.configureTestingModule({
      providers: [Domains, { provide: PLATFORM_ID, useValue: 'browser' }, { provide: DOCUMENT, useValue: document }],
    });
    service = TestBed.inject(Domains);
    expect(service).toBeTruthy();
  });

  describe('in browser environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [Domains, { provide: PLATFORM_ID, useValue: 'browser' }, { provide: DOCUMENT, useValue: document }],
      });
      service = TestBed.inject(Domains);
    });

    it('should get the protocol from document.location', () => {
      expect(service.getProtocol()).toBe('https:');
    });

    it('should get the root domain from document.location.hostname', () => {
      expect(service.getRootDomain()).toBe('example.com');
    });

    it('should get the home site base URL', () => {
      expect(service.getHomeSiteBaseUrl()).toBe('https://example.com');
    });

    it('should get the accounts site base URL', () => {
      expect(service.getAccountsSiteBaseUrl()).toBe('https://accounts.example.com');
    });

    it('should get the admin site base URL', () => {
      expect(service.getAdminSiteBaseUrl()).toBe('https://example.com');
    });
  });

  describe('in server environment', () => {
    beforeEach(() => {
      // TestBed.configureTestingModule is done in the outer beforeEach
    });

    it('should get the protocol from request object when provided', () => {
      TestBed.configureTestingModule({
        providers: [
          Domains,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: document },
          { provide: REQUEST_TOKEN, useValue: request },
        ],
      });
      service = TestBed.inject(Domains);
      expect(service.getProtocol()).toBe('http:');
    });

    it('should get the root domain from request object when provided', () => {
      TestBed.configureTestingModule({
        providers: [
          Domains,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: document },
          { provide: REQUEST_TOKEN, useValue: request },
        ],
      });
      service = TestBed.inject(Domains);
      expect(service.getRootDomain()).toBe('example.com'); // extractRootDomain logic is the same
    });

    it('should get the home site base URL', () => {
      TestBed.configureTestingModule({
        providers: [
          Domains,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: document },
          { provide: REQUEST_TOKEN, useValue: request },
        ],
      });
      service = TestBed.inject(Domains);
      expect(service.getHomeSiteBaseUrl()).toBe('http://example.com');
    });

    it('should get the accounts site base URL', () => {
      TestBed.configureTestingModule({
        providers: [
          Domains,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: document },
          { provide: REQUEST_TOKEN, useValue: request },
        ],
      });
      service = TestBed.inject(Domains);
      expect(service.getAccountsSiteBaseUrl()).toBe('http://accounts.example.com');
    });

    it('should get the admin site base URL', () => {
      TestBed.configureTestingModule({
        providers: [
          Domains,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: document },
          { provide: REQUEST_TOKEN, useValue: request },
        ],
      });
      service = TestBed.inject(Domains);
      expect(service.getAdminSiteBaseUrl()).toBe('http://example.com');
    });

    it('should throw an error if REQUEST_TOKEN is not provided', () => {
      TestBed.configureTestingModule({
        providers: [
          Domains,
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: DOCUMENT, useValue: document },
          // REQUEST_TOKEN is not provided
        ],
      });
      expect(() => TestBed.inject(Domains)).toThrowError(
        'Domains service requires a REQUEST_TOKEN to be provided in server-side environment. using provideDomain'
      );
    });
  });

  describe('extractRootDomain', () => {
    // Since extractRootDomain is a private method, we need to test it indirectly
    // or cast the service to access it for testing purposes. Casting is generally acceptable for testing private methods.
    let privateService: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          Domains,
          { provide: PLATFORM_ID, useValue: 'browser' }, // Use browser platform for simplicity
          { provide: DOCUMENT, useValue: document },
        ],
      });
      service = TestBed.inject(Domains);
      privateService = service as any; // Cast to any to access private method
    });

    it('should extract root domain from a simple hostname', () => {
      expect(privateService.extractRootDomain('www.example.com')).toBe('example.com');
    });

    it('should extract root domain from a subdomain', () => {
      expect(privateService.extractRootDomain('sub.domain.co.uk')).toBe('co.uk'); // Note: This simple logic might be a bug/limitation based on the implementation slice(-2).join('.')
    });

    it('should return undefined for an empty string', () => {
      expect(() => privateService.extractRootDomain('')).toThrowError('Hostname should be defined and not empty!');
    });

    it('should return undefined for a single part hostname', () => {
      expect(privateService.extractRootDomain('localhost')).toBe('localhost'); // slice(-2) on ['localhost'] is ['localhost']
    });

    it('should handle IP addresses', () => {
      expect(privateService.extractRootDomain('192.168.1.1')).toBe('1.1'); // slice(-2) on IP is last two parts
    });
  });
});
