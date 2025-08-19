export type AspectType = 'conjunction'|'sextile'|'square'|'trine'|'opposition';

export type TransitHit = {
  trPlanet: string; 
  toBody: string; 
  type: AspectType; 
  orb: number; 
  score: number;
  house?: number; 
  note?: string;
};

export type FullHoroscope = {
  dateISO: string;
  score: number; // 0-100
  tldr: { 
    mood: string; 
    energy: string; 
    focus: string; 
    lucky: { color: string; number: number } 
  };
  keyTransits: Array<{ title: string; why: string; advice: string }>;
  sections: { 
    love: string[]; 
    work: string[]; 
    health: string[]; 
    growth: string[] 
  };
  moon: { 
    sign: string; 
    phase: string; 
    house?: number; 
    tip: string 
  };
  timeline: Array<{ 
    part:'morning'|'day'|'evening'; 
    score:number; 
    tips:string[] 
  }>;
  debug?: { hits: TransitHit[] };
};