import { BottomNav } from '@/components/BottomNav';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <div className="px-4 py-4 max-w-lg mx-auto pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}