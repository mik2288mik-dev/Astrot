export type BirthPlace = { 
  lat: number; 
  lon: number; 
  displayName: string; 
  tz?: string 
};

export type BirthData = {
  name?: string;
  date: string;           // 'YYYY-MM-DD'
  time: string;           // 'HH:mm' (если unknownTime — '12:00')
  unknownTime?: boolean;
  place: BirthPlace;
};