type Toggles = {
  showSigns: boolean;
  showHouses: boolean;
  showPlanets: boolean;
  showAspects: boolean;
};

export default function Legend({ toggles, onToggle }: { toggles: Toggles; onToggle: (key: keyof Toggles) => void }) {
  const items: { key: keyof Toggles; label: string }[] = [
    { key: 'showSigns', label: 'Знаки' },
    { key: 'showHouses', label: 'Дома' },
    { key: 'showPlanets', label: 'Планеты' },
    { key: 'showAspects', label: 'Аспекты' }
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ key, label }) => {
        const on = toggles[key];
        return (
          <button
            key={key}
            className={`px-3 py-2 rounded-xl border shadow-sm typ-caption ${on ? 'bg-white/80 border-gray-200/60 text-on' : 'bg-white/40 border-gray-200/40 text-muted'}`}
            onClick={() => onToggle(key)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}