import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, Optional, Output, InjectionToken, ValueProvider } from '@angular/core';

import { SvgInjectorService } from './svg-injector.service';

/**
 * Injection token for providing the Express Request object in server-side environment
 */
const BASE_URL: InjectionToken<Request> = new InjectionToken<Request>('REQUEST_TOKEN');

/**
 * Provides environment configuration for the Domains service
 * @param request - The Express Request object to be used in server-side environment
 * @returns Environment providers configuration
 */
export const provideSsrSvgInjector = (baseUrl: string): ValueProvider => {
  return {
    provide: BASE_URL,
    useValue: baseUrl,
  };
};

@Component({
  selector: 'nge-svg-injector',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  host: {
    class: '[&>*]:w-full [&>*]:h-full',
  },
})
export class SvgInjector implements OnChanges {
  @Input() public path!: string;
  @Output() public inserted: EventEmitter<void> = new EventEmitter();

  constructor(private iconService: SvgInjectorService, private el: ElementRef, @Optional() @Inject(BASE_URL) private baseHref: string) {}

  ngOnChanges() {
    this.initSource();
  }

  initSource() {
    if (this.path.startsWith('http')) {
      this.iconService.getSvg(this.path).subscribe((svgContent) => {
        this.el.nativeElement.innerHTML = svgContent;
        this.inserted.emit();
      });
    } else {
      this.iconService.getSvg((this.baseHref ?? '') + this.path).subscribe((svgContent) => {
        this.el.nativeElement.innerHTML = svgContent;
        this.inserted.emit();
      });
    }
  }
}
