import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Redirector, provideSsrRedirector, RESPONSE_TOKEN } from './redirector.service';
import * as common from '@angular/common';
import { Response } from 'express';

jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  isPlatformBrowser: jest.fn(),
}));

describe('Redirector', () => {
  let service: Redirector;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      redirect: jest.fn(),
      end: jest.fn(),
    };

    // Mock window.location.href setup
    const originalWindowLocationDescriptor = Object.getOwnPropertyDescriptor(window, 'location');
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });

    return () => {
      // Restore original window.location after all tests in this suite
      if (originalWindowLocationDescriptor) {
        Object.defineProperty(window, 'location', originalWindowLocationDescriptor);
      } else {
        delete (window as any).location;
      }
    };
  });

  it('should be created', () => {
    TestBed.configureTestingModule({
      providers: [
        Redirector,
        { provide: RESPONSE_TOKEN, useValue: mockResponse },
        { provide: PLATFORM_ID, useValue: 'browser' }, // Default to browser for basic creation test
      ],
    });
    service = TestBed.inject(Redirector);
    expect(service).toBeTruthy();
  });

  describe('redirect', () => {
    describe('client-side', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [Redirector, { provide: RESPONSE_TOKEN, useValue: mockResponse }, { provide: PLATFORM_ID, useValue: 'browser' }],
        });
        service = TestBed.inject(Redirector);
      });

      it('should use window.location.href for client-side redirect', () => {
        // Mock isPlatformBrowser to simulate browser environment
        (common.isPlatformBrowser as jest.Mock).mockReturnValue(true);

        const url = 'https://example.com';
        service.redirect(url);

        expect((window as any).location.href).toBe(url);
        expect(mockResponse.redirect).not.toHaveBeenCalled();
        expect(mockResponse.end).not.toHaveBeenCalled();
      });
    });

    describe('server-side', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [Redirector, { provide: RESPONSE_TOKEN, useValue: mockResponse }, { provide: PLATFORM_ID, useValue: 'server' }],
        });
        service = TestBed.inject(Redirector);
      });

      it('should use response.redirect for server-side redirect', () => {
        // Mock isPlatformBrowser to simulate server environment
        (common.isPlatformBrowser as jest.Mock).mockReturnValue(false);

        const url = 'https://example.com/ssr';
        service.redirect(url);

        expect(mockResponse.redirect).toHaveBeenCalledWith(302, url);
        expect(mockResponse.end).toHaveBeenCalled();
        expect((window as any).location.href).toBe(''); // Should not affect window.location
      });

      it('should not do anything on server if response is not provided', () => {
        // Reconfigure TestBed to provide undefined for RESPONSE_TOKEN
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [Redirector, { provide: RESPONSE_TOKEN, useValue: undefined }, { provide: PLATFORM_ID, useValue: 'server' }],
        });
        service = TestBed.inject(Redirector);

        // Mock isPlatformBrowser to simulate server environment
        (common.isPlatformBrowser as jest.Mock).mockReturnValue(false);

        const url = 'https://example.com/no-response';
        service.redirect(url);

        expect(mockResponse.redirect).not.toHaveBeenCalled();
        expect(mockResponse.end).not.toHaveBeenCalled();
        expect((window as any).location.href).toBe(''); // Should not affect window.location
      });
    });
  });
});
