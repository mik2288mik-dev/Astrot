import manifest from '@/src/config/asset_manifest.json';

export default function ProfileBgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10">
        <img src={manifest.backgrounds.profile} alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 scrim-12" />
      </div>
      {children}
    </div>
  );
}