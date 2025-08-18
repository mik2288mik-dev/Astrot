'use client';
import { fmtBirth } from '../../../lib/birth/format';
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
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      location.assign('/natal');
    }
  };

  return (
    <div className={`birth-card ${mini ? 'mini' : ''}`}>
      <div className="birth-line">{fmtBirth(birth)}</div>
      {(showEdit || !onEdit) && (
        <button 
          className="birth-edit"
          onClick={handleEdit}
        >
          Изменить
        </button>
      )}
    </div>
  );
}