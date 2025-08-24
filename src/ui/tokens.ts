export const colors = {
  surfaceDark: '#1E1F36',
  accentFrom: '#CF5CFF',
  accentTo: '#FF6AD9',
} as const;

export const shadows = {
  navDark: '0 -4px 12px rgba(0,0,0,.45)',
  innerBar: 'inset 0 -1px 2px rgba(0,0,0,.40)',
  logo3D: '0 6px 12px rgba(0,0,0,.45)',
} as const;

export const radii = {
  nav: '8px',
  xl: '20px',
} as const;

export type UIColors = typeof colors;
export type UIShadows = typeof shadows;
export type UIRadii = typeof radii;

