import { IAppSidebarNavItem } from '@ecoma/angular';

export const appNavItems: IAppSidebarNavItem[] = [
  {
    id: 'profile',
    title: 'Profile',
    icon: `/duotone/id-card.svg`,
    route: '/my-account/profile',
  },
  {
    id: 'sessions',
    title: 'Sessions',
    icon: `/duotone/rectangle-vertical-history.svg`,
    route: '/my-account/sessions',
  },
  {
    id: 'settings',
    title: 'Marketing',
    icon: `/duotone/gear.svg`,
    route: '/my-account/settings',
  },
];
