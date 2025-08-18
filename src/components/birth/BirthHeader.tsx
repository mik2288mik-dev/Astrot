'use client';
import { formatBirthLine } from '../../../lib/birth/format';
import type { BirthData } from '../../../lib/birth/types';

export default function BirthHeader({ 
  birth, 
  mini = false,
  showEdit = false,
  onEdit 
}: { 
  birth: BirthData;
  mini?: boolean;
  showEdit?: boolean;
  onEdit?: () => void;
}) {
  return (
    <div 
      className={`rounded-xl flex items-center justify-between ${
        mini ? 'py-2 px-3 text-sm' : 'py-3 px-4 text-base'
      }`} 
      style={{ background: 'var(--astrot-chip-bg)', color: 'var(--astrot-text)' }}
    >
      <span>{formatBirthLine(birth)}</span>
      {showEdit && onEdit && (
        <button 
          onClick={onEdit}
          className="text-xs opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--astrot-text)' }}
        >
          Изменить
        </button>
      )}
    </div>
  );
}