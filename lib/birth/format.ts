import type { BirthData, BirthPlace } from './types';

export const formatDate = (iso: string) => 
  new Date(iso + 'T00:00:00').toLocaleDateString('ru-RU');

export const formatTime = (hhmm: string, unknown?: boolean) => 
  unknown ? 'время неизвестно' : hhmm;

export const shortPlace = (full: string) => {
  const cut = full.split(',').map(s => s.trim())
    .filter(s => !/\d{5,}/.test(s))
    .filter(s => !/(округ|область|федеральный|район)/i.test(s));
  return (cut[0] && cut[1]) ? `${cut[0]}, ${cut[1]}` : (cut[0] || full);
};

export const formatPlace = (p: BirthPlace) => p.displayName;

export const formatBirthLine = (b: BirthData) => {
  const d = formatDate(b.date);
  const t = formatTime(b.time, b.unknownTime);
  return `${b.name ? b.name + ' · ' : ''}${d}, ${formatPlace(b.place)} • ${t}`;
};

export const fmtBirth = (b: any) =>
  `${b.name ? b.name + ' · ' : ''}${new Date(b.date + 'T00:00:00').toLocaleDateString('ru-RU')}, ${shortPlace(b.place.displayName)} • ${b.unknownTime ? 'время неизвестно' : b.time}`;

export const isBirthComplete = (b?: Partial<BirthData>) =>
  !!(b?.date && b?.place?.lat && b?.place?.lon && b?.place?.displayName);