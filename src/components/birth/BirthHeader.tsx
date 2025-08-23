'use client';
import { fmtBirth } from '@/lib/birth/format';
import type { BirthData } from '@/lib/birth/types';

export default function BirthHeader({ 
  birth, 
  mini = false
}: { 
  birth: BirthData;
  mini?: boolean;
}) {
  return (
    <div className={`glass ${mini ? 'py-2 px-3' : 'py-3 px-4'}`}>
      <div style={{color:'var(--text)', fontSize: mini ? '14px' : '17px'}}>{fmtBirth(birth)}</div>
    </div>
  );
}