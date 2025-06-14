import { Component, OnInit, HostListener, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Domains } from '../domains';
import { AppLayoutHeaderComponent } from './app-layout-header.component';
import { AppLayoutService, IAppSidebarNavItem } from './app-layout.service';
import { AppNavComponent } from './app-nav.component';

@Component({
  selector: 'nge-app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule,  AppLayoutHeaderComponent, AppNavComponent],
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
          <nge-app-nav
            [navItems]="navItems"
            [isCollapsed]="layoutService.sidebarCollapsed()"
            [isHovered]="isHovered"
            [isSmallScreen]="isSmallScreen"
            [iconsBaseUrl]="iconsBaseUrl"
            (menuItemClick)="onMenuItemClick()"
            (submenuToggle)="toggleSubmenu($event)"
          />
        </aside>

        <!-- Main Content - Takes remaining space -->
        <main class="flex-1 overflow-y-auto bg-base-100 min-w-0 h-[calc(100vh-4rem)] lg:rounded-tl-2xl px-8" data-test-id="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
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
    this.iconsBaseUrl = this.domain.getIconsBaseUrl();
  }

  ngOnInit() {
    this.checkScreenSize();
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