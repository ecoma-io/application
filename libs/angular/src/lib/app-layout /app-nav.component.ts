import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgInjector } from '../svg-injector';
import { IAppSidebarNavItem } from './app-layout.service';

@Component({
  selector: 'nge-app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, SvgInjector],
  host: {
    class: 'flex-1 overflow-y-auto py-6 transition-all duration-300'
  },
  template: `
    <!-- Primary Navigation -->
    <ul class="space-y-2 mb-8 pr-2" [class.pr-0]="isCollapsed && !isHovered && !isSmallScreen">
      <li *ngFor="let item of navItems">
        <div [ngClass]="{ 'flex justify-center': isCollapsed && !isHovered && !isSmallScreen }">
          <ng-container *ngIf="!item.children || item.children.length === 0; else hasChildren">
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-primary/20 hover:bg-primary/20 relative active"
              class="flex justify-center items-center gap-3 px-4 py-2 rounded-r-full hover:bg-neutral/50 transition-all duration-200 cursor-pointer group"
              [class.rounded-l-full]="isCollapsed && !isHovered && !isSmallScreen"
              [class.justify-center]="isCollapsed && !isHovered && !isSmallScreen"
              [class.w-12]="isCollapsed && !isHovered && !isSmallScreen"
              [class.h-12]="isCollapsed && !isHovered && !isSmallScreen"
              [title]="isCollapsed && !isHovered && !isSmallScreen ? item.title : ''"
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
                [class.hidden]="isCollapsed && !isHovered && !isSmallScreen"
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
                class="flex justify-center items-center gap-3 px-4 py-2 rounded-r-full transition-all duration-200 cursor-pointer hover:bg-primary/20 group"
                [class.active]="parentLink.isActive"
                [class.rounded-l-full]="isCollapsed && !isHovered && !isSmallScreen"
                [class.justify-center]="isCollapsed && !isHovered && !isSmallScreen"
                [class.w-12]="isCollapsed && !isHovered && !isSmallScreen"
                [class.h-12]="isCollapsed && !isHovered && !isSmallScreen"
                [title]="isCollapsed && !isHovered && !isSmallScreen ? item.title : ''"
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
                  [class.hidden]="isCollapsed && !isHovered && !isSmallScreen"
                >
                  {{ item.title }}
                </div>

                <svg
                  class="w-4 h-4 transition-all duration-300"
                  [class.rotate-90]="isMenuExpanded(item.id) || parentLink.isActive"
                  [class.hidden]="isCollapsed && !isHovered && !isSmallScreen"
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
                  (isMenuExpanded(item.id) || parentLink.isActive) &&
                  (!isCollapsed || isHovered || isSmallScreen)
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
  `,
  styles: [
    ` ::host {
        -ms-overflow-style: none; /* Internet Explorer 10+ */
        scrollbar-width: none; /* Firefox, Safari 18.2+, Chromium 121+ */
      }
      ::host::-webkit-scrollbar {
        display: none; /* Older Safari and Chromium */
      }
    `,
  ],
})
export class AppNavComponent {
  @Input() navItems: IAppSidebarNavItem[] = [];
  @Input() isCollapsed = false;
  @Input() isHovered = false;
  @Input() isSmallScreen = false;
  @Input() iconsBaseUrl = '';

  @Output() menuItemClick = new EventEmitter<void>();
  @Output() submenuToggle = new EventEmitter<string>();

  private expandedMenus: Set<string> = new Set();

  iconUrl(path: string): string {
    return this.iconsBaseUrl + path;
  }

  onMenuItemClick() {
    this.menuItemClick.emit();
  }

  toggleSubmenu(menuId: string) {
    if (!this.isSmallScreen && this.isCollapsed && !this.isHovered) {
      return;
    }
    this.submenuToggle.emit(menuId);
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  }
}
