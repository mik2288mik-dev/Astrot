import { tv } from 'tailwind-variants';

export const button3d = tv({
  base:
    'inline-flex items-center justify-center rounded-full font-semibold text-white select-none transition active:translate-y-[2px] shadow-logo3D focus:outline-none focus-visible:ring-4 focus-visible:ring-white/25',
  variants: {
    size: {
      64: 'w-16 h-16 text-[15px]',
      48: 'w-12 h-12 text-[13px]',
    },
    state: {
      default:
        'bg-gradient-to-br from-accentFrom to-accentTo shadow-logo3D',
      active:
        'bg-gradient-to-br from-accentFrom to-accentTo shadow-logo3D translate-y-[2px]',
      disabled:
        'bg-white/20 text-white/50 shadow-none cursor-not-allowed',
    },
  },
  defaultVariants: {
    size: 64,
    state: 'default',
  },
});

export const iconButton = tv({
  base:
    'inline-flex items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm transition active:scale-[0.96]',
  variants: {
    size: {
      36: 'w-9 h-9',
      48: 'w-12 h-12',
    },
  },
  defaultVariants: {
    size: 36,
  },
});

export const appBar = tv({
  base: 'fixed left-0 right-0 z-50 bg-surfaceDark text-white',
  variants: {
    variant: {
      top: 'top-0 shadow-innerBar',
      bottom: 'bottom-0 border-t border-white/20 shadow-navDark',
    },
  },
  defaultVariants: {
    variant: 'top',
  },
});

export const label = tv({
  base: 'font-manrope text-white',
  variants: {
    size: {
      xs: 'text-[12px]',
      md: 'text-[15px]',
    },
    weight: {
      normal: 'font-normal',
      semibold: 'font-semibold',
    },
  },
  defaultVariants: {
    size: 'xs',
    weight: 'semibold',
  },
});

