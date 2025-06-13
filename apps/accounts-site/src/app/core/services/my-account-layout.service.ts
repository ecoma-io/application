import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface INavigationItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  children?: Omit<INavigationItem, 'children'>[];
  isExpanded?: boolean;
}

export const navigationItems: INavigationItem[] = [
  {
    id: 'profile',
    title: 'Profile',
    icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
    </svg>`,
    route: '/my-account/profile',
  },
  {
    id: 'sessions',
    title: 'Sessions',
    icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
    </svg>`,
    route: '/my-account/sessions',
  },
  {
    id: 'settings',
    title: 'Marketing',
    icon: `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
    </svg>`,
    route: '/my-account/settings',
  },
];

@Injectable({
  providedIn: 'root',
})
export class MyAccountLayoutService {
  private router = inject(Router);

  private _sidebarOpen = signal(false);
  private _sidebarCollapsed = signal(false);
  private _expandedMenus = signal<Set<string>>(new Set());
  private _currentUrl = signal('');

  sidebarOpen = this._sidebarOpen.asReadonly();
  sidebarCollapsed = this._sidebarCollapsed.asReadonly();
  expandedMenus = this._expandedMenus.asReadonly();
  currentUrl = this._currentUrl.asReadonly();

  constructor() {
    // Listen to router events to track current URL
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this._currentUrl.set(event.urlAfterRedirects);
      this.updateMenuStateBasedOnUrl(event.urlAfterRedirects);
    });

    // Set initial URL
    this._currentUrl.set(this.router.url);
    this.updateMenuStateBasedOnUrl(this.router.url);
  }

  toggleSidebar() {
    this._sidebarOpen.set(!this._sidebarOpen());
  }

  closeSidebar() {
    this._sidebarOpen.set(false);
  }

  toggleCollapse() {
    this._sidebarCollapsed.set(!this._sidebarCollapsed());
    // Close all expanded menus when collapsing sidebar
    if (this._sidebarCollapsed()) {
      this._expandedMenus.set(new Set());
    } else {
      // Re-expand menus based on current URL when expanding sidebar
      this.updateMenuStateBasedOnUrl(this._currentUrl());
    }
  }

  setSidebarState(open: boolean) {
    this._sidebarOpen.set(open);
  }

  setCollapsedState(collapsed: boolean) {
    this._sidebarCollapsed.set(collapsed);
  }

  toggleMenu(menuId: string) {
    const currentExpanded = new Set(this._expandedMenus());
    if (currentExpanded.has(menuId)) {
      currentExpanded.delete(menuId);
    } else {
      currentExpanded.add(menuId);
    }
    this._expandedMenus.set(currentExpanded);
  }

  isMenuExpanded(menuId: string): boolean {
    return this._expandedMenus().has(menuId);
  }

  closeAllMenus() {
    this._expandedMenus.set(new Set());
  }

  /**
   * Check if a menu item should be active based on current URL
   */
  isMenuItemActive(route?: string): boolean {
    if (!route) return false;

    const currentUrl = this._currentUrl();
    const cleanCurrentUrl = this.cleanUrl(currentUrl);
    const cleanRoute = this.cleanUrl(route);

    return cleanCurrentUrl === cleanRoute;
  }

  /**
   * Check if a parent menu should be active (has active children)
   */
  isParentMenuActive(children?: any[]): boolean {
    if (!children || children.length === 0) return false;

    return children.some((child) => this.isMenuItemActive(child.route));
  }

  /**
   * Update menu expansion state based on current URL
   */
  private updateMenuStateBasedOnUrl(url: string) {
    // Don't auto-expand if sidebar is collapsed
    if (this._sidebarCollapsed()) {
      return;
    }

    const menusToExpand = new Set<string>();
    const cleanUrl = this.cleanUrl(url);

    // Import navigation data to check against
    const allMenus = [...navigationItems];

    // Check each menu and its children
    allMenus.forEach((menu) => {
      if (menu.children && menu.children.length > 0) {
        // Check if any child route matches current URL
        const hasActiveChild = menu.children.some((child) => {
          const cleanChildRoute = this.cleanUrl(child.route || '');
          return cleanUrl === cleanChildRoute;
        });

        if (hasActiveChild) {
          menusToExpand.add(menu.id);
        }
      }
    });

    // Update expanded menus
    this._expandedMenus.set(menusToExpand);
  }

  /**
   * Clean URL by removing query params and fragments
   */
  private cleanUrl(url: string): string {
    if (!url) return '';

    // Remove query parameters and fragments
    const cleanUrl = url.split('?')[0].split('#')[0];

    // Ensure it starts with /
    return cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  }

  /**
   * Force update menu state (useful for manual refresh)
   */
  refreshMenuState() {
    this.updateMenuStateBasedOnUrl(this._currentUrl());
  }
}
