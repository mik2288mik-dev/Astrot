import type { BirthData, BirthPlace } from './types';

export const formatDate = (iso: string) => 
  new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU');

export const formatTime = (hhmm: string, unknown?: boolean) => 
  unknown ? 'время неизвестно' : hhmm;

export const formatPlace = (p: BirthPlace) => p.displayName;

export const formatBirthLine = (b: BirthData) => {
  const d = formatDate(b.date);
  const t = formatTime(b.time, b.unknownTime);
  return `${b.name ? b.name + ' · ' : ''}${d}, ${formatPlace(b.place)} • ${t}`;
};

export const isBirthComplete = (b?: Partial<BirthData>) =>
  !!(b?.date && b?.place?.lat && b?.place?.lon && b?.place?.displayName);