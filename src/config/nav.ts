import { IconHome2, IconChartDots, IconHeart, IconDots } from '@tabler/icons-react';

export const NAV_ITEMS = [
  { key: 'home',   href: '/',       label: 'Домой',           icon: IconHome2 },
  { key: 'chart',  href: '/chart',  label: 'Моя карта',       icon: IconChartDots },
  { key: 'compat', href: '/compat', label: 'Совместимость',   icon: IconHeart },
  { key: 'more',   href: '/more',   label: 'Ещё',             icon: IconDots },
] as const;

export const CAN_ENABLE_CALENDAR_TAB = false as const;