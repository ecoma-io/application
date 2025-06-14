import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgInjector } from '../svg-injector';
import { Domains } from '../domains';
import { AppLayoutService } from './app-layout.service';
import { AppAuthenticateService } from './app-authenticate.service';

@Component({
  selector: 'nge-app-layout-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SvgInjector],
  host: {
    class: 'h-16 bg-base-200 flex-shrink-0 relative z-30',
  },
  template: `
    <div class="flex items-center justify-between h-full px-3">
      <!-- Left section -->
      <div class="flex items-center gap-2 lg:w-64">
        <!-- Mobile menu button -->
        <button (click)="layoutService.toggleSidebar()" class="lg:hidden flex justify-center items-center btn btn-ghost btn-circle btn-sm">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>

        <!-- Desktop collapse button -->
        <button (click)="layoutService.toggleCollapse()" class="hidden lg:flex justify-center items-center btn btn-ghost btn-circle btn-sm">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>

        <nge-svg-injector [path]="iconUrl('/brands/ecoma-wordmark.svg')" class="h-5" />
      </div>

      <!-- Right section -->
      <div class="flex items-center lg:gap-1">
        <!-- Applications -->
        <div class="dropdown dropdown-end">
          <button class="btn btn-circle btn-ghost">
            <nge-svg-injector [path]="iconUrl('/duotone/grid-2.svg')" class="h-5 fill-base-content" />
          </button>
          <div class="dropdown-content shadow-lg bg-base-200 rounded-box w-80 mt-4 p-2 z-[1]">
            <div class="flex flex-wrap">
              <a [href]="accountSiteUrl" class="w-1/3 py-3 text-center rounded-lg hover:bg-primary/20 ">
                <div class="flex flex-col items-center gap-2">
                  <div class="w-14 h-14 p-4 bg-primary rounded-full">
                    <nge-svg-injector [path]="iconUrl('/duotone/user.svg')" class="fill-white" />
                  </div>
                  <span class="text-sm">Account</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- User menu -->
        <div class="dropdown dropdown-end">
          <button class="btn btn-circle btn-ghost p-1">
            <div class="flex justify-center items-center bg-primary rounded-full w-full h-full">
              <nge-svg-injector [path]="iconUrl('/duotone/user.svg')" class="fill-white block w-1/2" />
            </div>
          </button>
          <div class="dropdown-content shadow-lg bg-base-200 rounded-box w-80 mt-4 p-2 z-[1]">
            <div class="flex flex-col items-center w-full p-2 rounded-lg transition-all">
              <div class="relative">
                <div class="w-20 h-20 p-4 bg-primary rounded-full">
                  <nge-svg-injector [path]="iconUrl('/duotone/user.svg')" class="fill-white" />
                </div>
                <div class="bg-base-300/80 hover:bg-base-200/80 w-8 h-8 absolute bottom-0 right-0 rounded-full p-1.5">
                  <nge-svg-injector [path]="iconUrl('/regular/camera.svg')" class="fill-base-content/50 hover:fill-base-content/80" />
                </div>
              </div>
              <div class="font-medium text-base-content text-lg">Hi {{ firstName }}{{ lastName ? ' ' + lastName : '' }}!</div>
              <div class="text-xs text-base-content">{{ email }}</div>
              <div class="join join-horizontal w-full mt-8">
                <button class="btn join-item flex-1" (click)="gotoMyAccountProfile()">Profile</button>
                <button class="btn join-item flex-1" (click)="gotoMyAccountLogout()">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppLayoutHeaderComponent {
  iconsBaseUrl: string;
  accountSiteUrl: string;
  firstName?: string;
  lastName?: string;
  email?: string;

  constructor(private domain: Domains, protected layoutService: AppLayoutService, private appAuthenticateService: AppAuthenticateService) {
    // Lấy đường dẫn cơ sở cho các biểu tượng từ domain service
    this.iconsBaseUrl = this.domain.getIconsBaseUrl();
    this.accountSiteUrl = this.domain.getAccountsSiteBaseUrl();

    this.appAuthenticateService.getUserInfo().subscribe((userInfo) => {
      this.firstName = userInfo?.firstName;
      this.lastName = userInfo?.lastName;
      this.email = userInfo?.email;
    });
  }

  /**
   * Create full url of icon with icon path
   * @param path the path of icon
   * @returns full url of icon
   */
  iconUrl(path: string): string {
    return this.iconsBaseUrl + path;
  }

  gotoMyAccountLogout() {
    window.location.href = this.domain.getAccountsSiteBaseUrl() + '/my-account/sign-out';
  }

  gotoMyAccountProfile() {
    window.location.href = this.domain.getAccountsSiteBaseUrl() + '/my-account/profile';
  }
}
