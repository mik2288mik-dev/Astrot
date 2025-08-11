import { IconHome2, IconHeartHandshake, IconCalendar, IconDots } from '@tabler/icons-react';

export const NAV_ITEMS = [
  { key: 'home', label: 'Домой', icon: IconHome2, href: '/', isCenter: false },
  { key: 'compat', label: 'Совместимость', icon: IconHeartHandshake, href: '/compat', isCenter: false },
  { key: 'chart', icon: 'planet', isCenter: true, href: '/chart' },
  { key: 'calendar', label: 'Календарь', icon: IconCalendar, href: '/calendar', isCenter: false },
  { key: 'more', label: 'Ещё', icon: IconDots, href: '/more', isCenter: false },
] as const;

export const CAN_ENABLE_CALENDAR_TAB = true as const;