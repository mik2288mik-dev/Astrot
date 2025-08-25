export type SavedChart = {
  id: string;
  userId?: number | undefined;
  createdAt: number;
  input: any;   // BirthData
  result: any;  // NatalResult
  pinned?: boolean | undefined;
  title?: string | undefined;
  threads?: { id:string; title:string; nodeIds:string[]; createdAt:number }[] | undefined;
};

const KEY = 'astrot.charts.v1';

function read(): SavedChart[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function write(list: SavedChart[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const ChartsStore = {
  save(c: SavedChart) {
    const list = read();
    const i = list.findIndex(x => x.id === c.id);
    if (i >= 0) list[i] = { ...list[i], ...c }; else list.unshift(c);
    write(list);
  },
  update(id: string, patch: Partial<Omit<SavedChart, 'id'>>) {
    const list = read();
    const i = list.findIndex(x => x.id === id);
    if (i >= 0) { 
      list[i] = { ...list[i], ...patch, id } as SavedChart;
      write(list);
    }
  },
  list(): SavedChart[] { return read(); },
  get(id: string): SavedChart | undefined { return read().find(x => x.id === id); },
  remove(id: string) { write(read().filter(x => x.id !== id)); },
  getPinned(): SavedChart | undefined { return read().find(x => x.pinned); },
  pin(id: string) {
    const list = read().map(x => ({ ...x, pinned: x.id === id }));
    write(list);
  }
};