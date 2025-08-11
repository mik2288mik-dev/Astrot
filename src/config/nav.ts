export const BOTTOM_TABS = [
  { key: 'home',   href: '/',        label: 'Домой',          icon: 'Home' },
  { key: 'chart',  href: '/chart',   label: 'Моя карта',      icon: 'Chart' },
  { key: 'compat', href: '/compat',  label: 'Совместимость',  icon: 'Heart' },
  { key: 'more',   href: '/more',    label: 'Ещё',            icon: 'Dots'  },
] as const;

export const CAN_ENABLE_CALENDAR_TAB = false as const;