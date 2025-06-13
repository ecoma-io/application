import { Component, OnInit, HostListener, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Domains } from '../domains';
import { SvgInjector } from '../svg-injector';
import { AppLayoutHeaderComponent } from './app-layout-header.component';
import { AppLayoutService, IAppSidebarNavItem } from './app-layout.service';


@Component({
  selector: 'nge-app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SvgInjector, AppLayoutHeaderComponent],
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
    <div class="min-h-screen bg-base-200 flex flex-col">
      <!-- Header - Fixed height, full width -->
      <nge-app-layout-header class="h-16 bg-base-200 flex-shrink-0 relative z-30" data-test-id="header" />

      <!-- Content Area - Flex container for sidebar and main content -->
      <div class="flex flex-1 relative h-[calc(100vh-4rem)]">
        <!-- Sidebar - Responsive positioning -->
        <aside
          class="bg-base-200 flex flex-col transition-all duration-300 ease-in-out overflow-y-auto flex-shrink-0 h-screen lg:h-[calc(100vh-4rem)]"
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
          <nav class="flex-1 overflow-y-auto py-6 transition-all duration-300">
            <!-- Primary Navigation -->
            <ul class="space-y-2 mb-8">
              <li *ngFor="let item of navItems">
                <div [ngClass]="{ 'flex justify-center': layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen }">
                  <ng-container *ngIf="!item.children || item.children.length === 0; else hasChildren">

                    <a
                      [routerLink]="item.route"
                      routerLinkActive="bg-primary/20 hover:bg-primary/20 relative active"
                      class="flex justify-center items-center gap-3 px-4 py-2 rounded-r-lg transition-all duration-200 cursor-pointer group hover:bg-neutral/20"
                      [class.rounded-l-full]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                      [class.rounded-r-full]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                      [class.justify-center]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                      [class.w-12]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                      [class.h-12]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                      [title]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen ? item.title : ''"
                      (click)="onMenuItemClick()"
                      [attr.data-test-id]="'nav-' + item.id"
                    >

                      <!-- Nav Item Icons -->
                      <nge-svg-injector
                        [path]="iconUrl(item.icon)"
                        class="flex-shrink-0 w-[1.1rem] h-[1.1rem] fill-base-content hover:fill-primary"
                      />

                       <!-- Nav Item Title -->
                      <div
                        class="flex-1 whitespace-nowrap font-light"
                        [class.hidden]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                      >
                        {{ item.title }}
                      </div>
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
                        class="flex w-full justify-center items-center gap-3 px-4 rounded-r-lg hover:bg-dark-700 transition-all duration-200 cursor-pointer group hover:!bg-base-300 hover:!text-white"
                        [class.active]="parentLink.isActive"
                        [class.justify-center]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                        [class.w-12]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                        [class.h-12]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                        [title]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen ? item.title : ''"
                        [attr.data-test-id]="'nav-' + item.id"
                      >

                        <!-- Nav Item Icons -->
                        <nge-svg-injector
                          [path]="iconUrl(item.icon)"
                          class="flex-shrink-0 w-[1.1rem] h-[1.1rem] fill-base-content hover:fill-primary"
                        />

                        <!-- Nav Item Title -->
                        <div
                          class="flex-1 whitespace-nowrap font-light"
                          [class.hidden]="layoutService.sidebarCollapsed() && !isHovered && !isSmallScreen"
                        >
                          {{ item.title }}
                        </div>

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
        <main class="flex-1 overflow-y-auto bg-base-100 min-w-0 h-[calc(100vh-4rem)] lg:rounded-tl-2xl px-8" data-test-id="main-content">
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
export class AppLayoutComponent implements OnInit {
  navItems: IAppSidebarNavItem[];

  isHovered = false;
  isSmallScreen = false;
  iconsBaseUrl: string;


  constructor(
    @Optional() @Inject('SIDEBAR_NAV_ITEMS') sidebarNavItems: IAppSidebarNavItem[],
    private domain: Domains,
    protected layoutService: AppLayoutService,
  ) {
    this.navItems = sidebarNavItems;

    // Lấy đường dẫn cơ sở cho các biểu tượng từ domain service
    this.iconsBaseUrl = this.domain.getIconsBaseUrl();


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
