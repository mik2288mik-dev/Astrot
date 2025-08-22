import React from 'react';
import Image from 'next/image';

interface AstrotLogoProps {
  size?: number;
  className?: string;
}

export const AstrotLogo: React.FC<AstrotLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image
        src="/logo.png"
        alt="Astrot"
        width={size}
        height={size}
        className="drop-shadow-sm"
        priority
        style={{
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default AstrotLogo;
