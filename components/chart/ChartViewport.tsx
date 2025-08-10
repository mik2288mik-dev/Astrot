"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { angleToPoint, formatDegree, signNameRu } from './utils';
import WheelBase from './WheelBase';
import HousesLayer from './HousesLayer';
import PlanetsLayer from './PlanetsLayer';
import AspectsLayer from './AspectsLayer';
import Legend from './Legend';
import InsightsPane from './InsightsPane';

export type ChartPlanet = { name: string; lon: number; retro?: boolean };
export type ChartHouses = { cusps: number[]; asc: number; mc: number } | null;
export type ChartAspect = { a: string; b: string; type: string; orb: number };

export type ChartData = {
  jdUt: number;
  tz: string;
  planets: ChartPlanet[];
  houses: ChartHouses;
  aspects: ChartAspect[];
  sunSign?: string;
};

export type ChartViewportProps = {
  data: ChartData;
};

export default function ChartViewport({ data }: ChartViewportProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [size, setSize] = useState(360);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);

  const [showSigns, setShowSigns] = useState(true);
  const [showHouses, setShowHouses] = useState(true);
  const [showPlanets, setShowPlanets] = useState(true);
  const [showAspects, setShowAspects] = useState(true);

  const [selected, setSelected] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; title: string; subtitle?: string } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.contentRect.width;
        const s = Math.max(320, Math.min(700, Math.floor(w)));
        setSize(s);
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.48; // внешняя окружность

  const planetPositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number; lon: number }>();
    data.planets.forEach((p) => {
      const pt = angleToPoint(cx, cy, outerR * 0.78, p.lon);
      map.set(p.name, { ...pt, lon: p.lon });
    });
    return map;
  }, [data.planets, cx, cy, outerR]);

  // Панорамирование
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    setPan({ x: e.clientX - drag.x, y: e.clientY - drag.y });
  };
  const onPointerUp = () => setDrag(null);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const next = Math.max(0.8, Math.min(2.2, scale + (e.deltaY > 0 ? -0.08 : 0.08)));
    setScale(next);
  };

  const handleSelectPlanet = useCallback((name: string | null) => {
    setSelected(name);
    if (name && planetPositions.has(name)) {
      const p = planetPositions.get(name)!;
      const sign = signNameRu(p.lon);
      const deg = formatDegree(p.lon);
      setTooltip({ x: p.x, y: p.y, title: name, subtitle: `${deg} • ${sign}` });
    } else {
      setTooltip(null);
    }
  }, [planetPositions]);

  const exportPng = useCallback(async () => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('width', String(size));
    clone.setAttribute('height', String(size));
    clone.removeAttribute('style');

    const xml = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size + 36; // место под брендинг
    const ctx = canvas.getContext('2d')!;
    // фоновый мягкий градиент
    const grd = ctx.createLinearGradient(0, 0, size, size);
    grd.addColorStop(0, '#FFF4E6');
    grd.addColorStop(0.5, '#FFD1DC');
    grd.addColorStop(1, '#E6D6FF');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0);
    // брендинг
    ctx.fillStyle = 'rgba(15,16,32,.7)';
    ctx.font = '600 12px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Astrot', size / 2, size + 22);

    URL.revokeObjectURL(url);

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'astrot-chart.png';
    a.click();
  }, [size]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="glass p-3 sm:p-4 grid gap-3">
        <div className="relative">
          <div
            className="relative mx-auto touch-pan-y select-none"
            style={{ width: size, height: size }}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${size} ${size}`}
              className="block mx-auto"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: 'center center' }}
              role="img"
              aria-label="Натальная карта"
            >
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g>
                <WheelBase cx={cx} cy={cy} r={outerR} showSigns={showSigns} />
                {showHouses && <HousesLayer cx={cx} cy={cy} r={outerR * 0.92} houses={data.houses} />}
                {showAspects && (
                  <AspectsLayer
                    cx={cx}
                    cy={cy}
                    r={outerR * 0.78}
                    aspects={data.aspects}
                    planetPositions={planetPositions}
                    highlight={selected}
                  />
                )}
                {showPlanets && (
                  <PlanetsLayer
                    cx={cx}
                    cy={cy}
                    r={outerR * 0.78}
                    planets={data.planets}
                    selected={selected}
                    onSelect={handleSelectPlanet}
                  />
                )}
              </g>
            </svg>

            {tooltip && (
              <div
                className="absolute -translate-x-1/2 -translate-y-[110%] px-2 py-1 rounded-xl bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-card typ-caption"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                <div className="font-semibold text-on">{tooltip.title}</div>
                {tooltip.subtitle && <div className="text-muted">{tooltip.subtitle}</div>}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Legend
            toggles={{ showSigns, showHouses, showPlanets, showAspects }}
            onToggle={(k) => {
              if (k === 'showSigns') setShowSigns((v) => !v);
              if (k === 'showHouses') setShowHouses((v) => !v);
              if (k === 'showPlanets') setShowPlanets((v) => !v);
              if (k === 'showAspects') setShowAspects((v) => !v);
            }}
          />
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-xl bg-white/70 border border-gray-200/60 shadow-sm hover:bg-white/90 typ-caption"
              onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
            >Сброс</button>
            <button
              className="px-3 py-2 rounded-xl bg-on text-surface shadow-card typ-caption"
              onClick={exportPng}
            >Сохранить</button>
          </div>
        </div>

        <InsightsPane data={data} onFocusItem={(key) => setSelected(key)} />
      </div>
    </div>
  );
}