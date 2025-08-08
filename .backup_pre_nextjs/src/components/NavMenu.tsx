import React from 'react';

interface NavMenuProps {
  t: {
    home: string;
    profile: string;
    about: string;
  };
}

export default function NavMenu({ t }: NavMenuProps) {
  return (
    <nav className="flex justify-around py-2 text-xs bg-black bg-opacity-30">
      <button className="font-bold">{t.home}</button>
      <button>{t.profile}</button>
      <button>{t.about}</button>
    </nav>
  );
}
