import { IconHome2, IconMapPin, IconHeartHandshake, IconDots } from '@tabler/icons-react';

export const NAV_ITEMS = [
  { key: 'home',   href: '/',       label: 'Домой',           icon: IconHome2 },
  { key: 'chart',  href: '/chart',  label: 'Моя карта',       icon: IconMapPin },
  { key: 'compat', href: '/compat', label: 'Совместимость',   icon: IconHeartHandshake },
  { key: 'more',   href: '/more',   label: 'Ещё',             icon: IconDots },
] as const;

export const CAN_ENABLE_CALENDAR_TAB = false as const;