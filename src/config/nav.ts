import { IconHome2, IconHeartHandshake, IconCalendar, IconDots } from '@tabler/icons-react';

export const NAV_ITEMS = [
  { key: 'home', label: 'Домой', icon: IconHome2, href: '/' },
  { key: 'compat', label: 'Совместимость', icon: IconHeartHandshake, href: '/compat' },
  { key: 'chart', icon: 'planet', isCenter: true, href: '/chart' },
  { key: 'calendar', label: 'Календарь', icon: IconCalendar, href: '/calendar' },
  { key: 'more', label: 'Ещё', icon: IconDots, href: '/more' },
] as const;

export const CAN_ENABLE_CALENDAR_TAB = true as const;