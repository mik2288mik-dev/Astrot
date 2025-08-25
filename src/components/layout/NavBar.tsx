'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="cartoon-nav">
      {/* Левая кнопка - Главная */}
      <Link
        href="/"
        className={`nav-item ${pathname === '/' ? 'active' : ''}`}
      >
        <div className="nav-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
        <span className="nav-label">Главная</span>
      </Link>

      {/* Центральная кнопка с логотипом */}
      <Link
        href="/chart"
        className={`nav-item nav-center ${pathname === '/chart' || pathname === '/natal' ? 'active' : ''}`}
      >
        <div className="nav-logo-wrapper">
          <Image
            src="/logo.png"
            alt="Astrot"
            width={48}
            height={48}
            className="nav-logo"
            priority
          />
          <div className="nav-logo-glow"></div>
        </div>
        <span className="nav-label">Карта</span>
      </Link>

      {/* Правая кнопка - Ещё */}
      <Link
        href="/functions"
        className={`nav-item ${pathname === '/functions' || pathname === '/profile' ? 'active' : ''}`}
      >
        <div className="nav-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="2"/>
            <circle cx="12" cy="5" r="2"/>
            <circle cx="12" cy="19" r="2"/>
          </svg>
        </div>
        <span className="nav-label">Ещё</span>
      </Link>

      <style jsx>{`
        .cartoon-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 20px calc(env(safe-area-inset-bottom) + 10px);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 240, 230, 0.98) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 -4px 20px rgba(183, 148, 246, 0.15);
          z-index: 100;
          border-top: 2px solid rgba(183, 148, 246, 0.1);
          border-radius: 32px 32px 0 0;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 8px 16px;
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          text-decoration: none;
          position: relative;
          cursor: pointer;
          min-width: 80px;
        }

        .nav-item:hover {
          transform: translateY(-2px) scale(1.05);
        }

        .nav-item:active {
          transform: scale(0.95);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #FFE0EC 0%, #E8D5FF 100%);
          box-shadow: 0 4px 12px rgba(183, 148, 246, 0.25);
        }

        .nav-item.active .nav-icon {
          color: #B794F6;
          transform: scale(1.1);
        }

        .nav-item.active .nav-label {
          color: #B794F6;
          font-weight: 700;
        }

        .nav-center {
          position: relative;
          margin: 0 10px;
        }

        .nav-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9B8FAB;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .nav-logo-wrapper {
          position: relative;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #B794F6 0%, #9F7AEA 100%);
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(183, 148, 246, 0.4);
          border: 3px solid rgba(255, 255, 255, 0.9);
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          margin-bottom: 4px;
        }

        .nav-center:hover .nav-logo-wrapper {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 12px 32px rgba(183, 148, 246, 0.5);
        }

        .nav-center.active .nav-logo-wrapper {
          transform: scale(1.15);
          animation: cartoonPulse 2s ease-in-out infinite;
        }

        .nav-logo {
          width: 40px !important;
          height: 40px !important;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .nav-logo-glow {
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, rgba(183, 148, 246, 0.4) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .nav-center:hover .nav-logo-glow,
        .nav-center.active .nav-logo-glow {
          opacity: 1;
          animation: glowPulse 2s ease-in-out infinite;
        }

        .nav-label {
          font-size: 13px;
          font-weight: 600;
          color: #9B8FAB;
          font-family: 'Comic Neue', 'Baloo 2', sans-serif;
          transition: all 0.3s ease;
        }

        @keyframes cartoonPulse {
          0%, 100% {
            transform: scale(1.15);
          }
          50% {
            transform: scale(1.25);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </nav>
  );
}
