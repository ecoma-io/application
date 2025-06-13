import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Domains, SvgInjector } from '@ecoma/angular';
import { MyAccountLayoutService, navigationItems } from '../../core/services/my-account-layout.service';
import { AuthenticateService } from '../../core/services/authenticate.service';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SvgInjector],
  template: `
    <!-- Mobile Overlay - Positioned absolutely to cover everything -->
    <div
      *ngIf="layoutService.sidebarOpen() && isSmallScreen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
      (click)="layoutService.closeSidebar()"
      (keydown.enter)="layoutService.closeSidebar()"
      (keydown.space)="layoutService.closeSidebar()"
      tabindex="0"
      role="button"
      aria-label="Close sidebar"
    ></div>

    <!-- Main Container - Full viewport height -->
    <div class="min-h-screen bg-base-100 flex flex-col">
      <!-- Header - Fixed height, full width -->
      <header class="h-16 bg-base-100 flex-shrink-0 relative z-30" data-test-id="header">
        <div class="flex items-center justify-between h-full pl-4 pr-4 lg:pr-6 lg:pl-2">
          <!-- Left section -->
          <div class="flex items-center gap-2 lg:w-64">
            <!-- Mobile menu button -->
            <button
              (click)="layoutService.toggleSidebar()"
              class="lg:hidden p-2 rounded-lg hover:bg-dark-700 text-dark-300 hover:text-white transition-colors focus-ring"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>

            <!-- Desktop collapse button -->
            <button
              (click)="layoutService.toggleCollapse()"
              class="hidden lg:block p-2 rounded-lg hover:bg-dark-700 text-dark-300 hover:text-white transition-colors focus-ring"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>

            <nge-svg-injector [path]="iconUrl('/brands/ecoma-wordmark.svg')" class="h-5 hidden lg:block" />
          </div>

          <nge-svg-injector [path]="iconUrl('/brands/ecoma-wordmark.svg')" class="h-5 lg:hidden" />

          <!-- Right section -->
          <div class="flex items-center gap-3">
            <!-- Mobile Menu -->
            <button class="p-2 rounded-lg hover:bg-dark-700 text-dark-300 hover:text-white transition-colors focus-ring lg:hidden">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 52 52" enable-background="new 0 0 52 52" xml:space="preserve">
                <path
                  d="M20,44c0-3.3,2.7-6,6-6s6,2.7,6,6s-2.7,6-6,6S20,47.3,20,44z M20,26c0-3.3,2.7-6,6-6s6,2.7,6,6s-2.7,6-6,6
                  S20,29.3,20,26z M20,8c0-3.3,2.7-6,6-6s6,2.7,6,6s-2.7,6-6,6S20,11.3,20,8z"
                />
              </svg>
            </button>

            <!-- Theme toggle -->
            <button class="p-2 rounded-lg hover:bg-dark-700 text-dark-300 hover:text-white transition-colors focus-ring hidden lg:block">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>

            <!-- User menu -->
            <div class="dropdown dropdown-end hidden lg:block">
              <button class="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-700 transition-colors">
                <img
                  src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=40&h=40&fit=crop&crop=face"
                  alt="User avatar"
                  class="w-8 h-8 rounded-full object-cover"
                />
              </button>
              <div class="dropdown-content shadow-lg bg-base-100 rounded-box w-80 mt-2 p-2 z-[1]">
                <div class="flex flex-col items-center w-full gap-3 p-2 rounded-lg hover:bg-dark-700 transition-colors">
                  <div class="relative">
                    <img
                      src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=40&h=40&fit=crop&crop=face"
                      alt="User avatar"
                      class="w-28 h-28 rounded-full object-cover"
                    />
                    <div class="bg-base-300/80 hover:bg-base-200/80 w-8 h-8 absolute bottom-0 right-0 rounded-full p-1.5">
                      <nge-svg-injector [path]="iconUrl('/regular/camera.svg')"  class="fill-base-content/50 hover:fill-base-content/80" />
                    </div>
                  </div>
                  <div class="font-medium text-white">{{ firstName }} {{ lastName }}</div>
                  <div class="text-xs text-dark-400">{{email}}</div>
                  <div class="join join-horizontal w-full">
                    <a class="btn join-item flex-1" routerLink="/my-account/profile">Profile</a>
                    <a class="btn join-item flex-1"  routerLink="/my-account/logout" >Sign Out</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area - Flex container for sidebar and main content -->
      <div class="flex flex-1 relative h-[calc(100vh-4rem)]">
        <!-- Sidebar - Responsive positioning -->
        <aside
          class="bg-base-100 border-r border-base-200 flex flex-col transition-all duration-300 ease-in-out overflow-y-auto flex-shrink-0 h-screen lg:h-[calc(100vh-4rem)]"
          [ngClass]="{
            'lg:w-64': !layoutService.sidebarCollapsed() || isHovered,
            'lg:w-16': layoutService.sidebarCollapsed() && !isHovered,
            'lg:shadow-2xl lg:shadow-primary-500/10': layoutService.sidebarCollapsed() && isHovered,
            'lg:relative lg:z-auto': true,
            'fixed top-0 left-0 h-full w-64 z-50': isSmallScreen,
            'transform -translate-x-full': isSmallScreen && !layoutService.sidebarOpen(),
            'transform translate-x-0': isSmallScreen && layoutService.sidebarOpen()
          }"
          (mouseenter)="onMouseEnter()"
          (mouseleave)="onMouseLeave()"
          data-test-id="sidebar"
        >
          <!-- Navigation - Scrollable -->
          <nav
            class="flex-1 overflow-y-auto py-6 transition-all duration-300"
            [ngClass]="{
              'px-4': !layoutService.sidebarCollapsed() || isHovered || isSmallScreen,
              'px-2': layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen
            }"
          >
            <!-- Primary Navigation -->
            <ul class="space-y-2 mb-8">
              <li *ngFor="let item of primaryNavItems">
                <div [ngClass]="{ 'flex justify-center': layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen }">
                  <ng-container *ngIf="!item.children || item.children.length === 0; else hasChildren">
                    <a
                      [routerLink]="item.route"
                      routerLinkActive="bg-primary text-white relative active"
                      class="flex justify-center items-center gap-3 px-4 py-3 rounded-lg text-dark-300 hover:bg-dark-700 transition-all duration-200 cursor-pointer group hover:!bg-base-300 hover:!text-white"
                      [class.justify-center]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                      [class.w-12]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                      [class.h-12]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                      [title]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen ? item.title : ''"
                      (click)="onMenuItemClick()"
                      [attr.data-test-id]="'nav-' + item.id"
                    >
                      <span [innerHTML]="sanitizer.bypassSecurityTrustHtml(item.icon)" class="flex-shrink-0 w-5 h-5 transition-all"></span>

                      <span
                        class="flex-1 transition-all duration-300 overflow-hidden whitespace-nowrap"
                        [class.opacity-0]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                        [class.opacity-100]="!layoutService.sidebarCollapsed() || isHovered || isSmallScreen"
                        [class.w-0]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                        [class.ml-0]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                      >
                        {{ item.title }}
                      </span>
                    </a>
                  </ng-container>

                  <ng-template #hasChildren>
                    <div
                      class="w-full"
                      routerLinkActive="parent-active active"
                      [routerLinkActiveOptions]="{ exact: false }"
                      #parentLink="routerLinkActive"
                      [ngClass]="{ 'parent-active': parentLink.isActive }"
                    >
                      <button
                        (click)="toggleSubmenu(item.id)"
                        class="flex w-full justify-center items-center gap-3 px-4 py-3 rounded-lg text-dark-300 hover:bg-dark-700 transition-all duration-200 cursor-pointer group hover:!bg-base-300 hover:!text-white"
                        [class.active]="parentLink.isActive"
                        [class.justify-center]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                        [class.w-12]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                        [class.h-12]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                        [title]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen ? item.title : ''"
                        [attr.data-test-id]="'nav-' + item.id"
                      >
                        <span [innerHTML]="sanitizer.bypassSecurityTrustHtml(item.icon)" class="flex-shrink-0 w-5 h-5"></span>

                        <span
                          class="flex-1 text-left transition-all duration-300 overflow-hidden whitespace-nowrap"
                          [class.opacity-0]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                          [class.opacity-100]="!layoutService.sidebarCollapsed() || isHovered || isSmallScreen"
                          [class.w-0]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                          [class.ml-0]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                        >
                          {{ item.title }}
                        </span>

                        <svg
                          class="w-4 h-4 transition-all duration-300"
                          [class.rotate-90]="layoutService.isMenuExpanded(item.id) || parentLink.isActive"
                          [class.hidden]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </button>

                      <!-- Submenu -->
                      <div
                        *ngIf="
                          (layoutService.isMenuExpanded(item.id) || parentLink.isActive) &&
                          (!layoutService.sidebarCollapsed() || isHovered || isSmallScreen)
                        "
                        class="overflow-hidden"
                      >
                        <ul class="mt-2 space-y-1">
                          <li *ngFor="let child of item.children">
                            <a
                              [routerLink]="child.route"
                              routerLinkActive="active"
                              class="flex items-center justify-between px-4 py-2 ml-6 text-sm text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all duration-200 cursor-pointer"
                              (click)="onMenuItemClick()"
                              [attr.data-test-id]="'nav-' + child.id"
                            >
                              {{ child.title }}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </ng-template>
                </div>
              </li>
            </ul>
          </nav>
        </aside>

        <!-- Main Content - Takes remaining space -->
        <main class="flex-1 overflow-y-auto bg-base-200 min-w-0 h-[calc(100vh-4rem)] lg:rounded-tl-2xl" data-test-id="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      aside nav {
        -ms-overflow-style: none; /* Internet Explorer 10+ */
        scrollbar-width: none; /* Firefox, Safari 18.2+, Chromium 121+ */
      }

      aside nav::-webkit-scrollbar {
        display: none; /* Older Safari and Chromium */
      }
    `,
  ],
})
export class MyAccountComponent implements OnInit {

  primaryNavItems = navigationItems;

  isHovered = false;
  isSmallScreen = false;
  iconsBaseUrl: string;
  firstName?: string;
  lastName?: string;
  email?: string;

  constructor(
    private domain: Domains,
    private title: Title,
    protected layoutService: MyAccountLayoutService,
    protected sanitizer: DomSanitizer,
    protected authenticateService: AuthenticateService
  ) {
    // Thiết lập tiêu đề cho trang web
    this.title.setTitle('Identity Authentication');

    // Lấy đường dẫn cơ sở cho các biểu tượng từ domain service
    this.iconsBaseUrl = this.domain.getIconsBaseUrl();

    const userInfo = this.authenticateService.getCurrentUserInfo();
    this.firstName = userInfo?.firstName;
    this.lastName = userInfo?.lastName;
    this.email = userInfo?.email;
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  /**
   * Create full url of icon with icon path
   * @param path the path of icon
   * @returns full url of icon
   */
  iconUrl(path: string): string {
    return this.iconsBaseUrl + path;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1024;

    // Auto-close sidebar on desktop
    if (!this.isSmallScreen) {
      this.layoutService.closeSidebar();
    }
  }

  onMouseEnter() {
    // Only enable hover expansion on desktop when sidebar is collapsed
    if (!this.isSmallScreen && this.layoutService.sidebarCollapsed()) {
      this.isHovered = true;
    }
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  onMenuItemClick() {
    // Close sidebar on mobile when menu item is clicked
    if (this.isSmallScreen) {
      this.layoutService.closeSidebar();
    }
  }

  toggleSubmenu(menuId: string) {
    // Don't toggle if sidebar is collapsed and not hovered on desktop
    if (!this.isSmallScreen && this.layoutService.sidebarCollapsed() && !this.isHovered) {
      return;
    }
    this.layoutService.toggleMenu(menuId);
  }


}
