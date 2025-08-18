export const pastel = {
  pink: '#FFE5EC',
  purple: '#E8E3FF',
  blue: '#E3F2FF',
  mint: '#E5FFF7',
  peach: '#FFF0E5',
  lavender: '#F3E8FF',
  cream: '#FFF9F0',
} as const;

export type PastelColor = keyof typeof pastel;
