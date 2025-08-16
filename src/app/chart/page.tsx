'use client';
import { useState } from 'react';

type Form = { name:string; date:string; time:string; tzOffset:number; place:string; lat:number; lon:number; houseSystem:'P'|'W' }

interface Planet {
  key: string;
  lon: number;
  lat: number;
  speed: number;
  sign: string;
  house: number;
}

interface Houses {
  cusps: number[];
  asc: number;
  mc: number;
}

interface ChartData {
  jdUT: number;
  planets: Planet[];
  houses: Houses;
  bigThree: {
    Sun: string;
    Moon: string;
    Ascendant: string;
  };
}

export default function ChartPage(){
  const [f,setF] = useState<Form>({ name:'Михаил', date:'1989-06-03', time:'23:23', tzOffset:3, place:'Сергиев Посад', lat:56.3159, lon:38.1359, houseSystem:'P' });
  const [loading,setLoading] = useState(false);
  const [chart,setChart] = useState<ChartData | null>(null);
  const [err,setErr] = useState<string>('');

  async function calc(e?:React.FormEvent){
    e?.preventDefault(); setErr(''); setChart(null); setLoading(true);
    try{
      const r = await fetch('/api/chart',{ method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ date:f.date, time:f.time, tzOffset:f.tzOffset, lat:f.lat, lon:f.lon, houseSystem:f.houseSystem }) });
      const j = await r.json(); if(!j.ok) throw new Error(j.error || 'calc error'); setChart(j.chart);
    }catch(e: unknown){ 
      const error = e instanceof Error ? e.message : 'Ошибка расчёта';
      setErr(error); 
    } finally{ setLoading(false); }
  }

  return (
    <main className="page">
      <section className="card" style={{gap:12}}>
        <h2 style={{fontSize:22, fontWeight:800}}>Данные рождения</h2>
        <form onSubmit={calc} style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
          <div style={{gridColumn:'1 / -1'}}><input placeholder="Имя" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></div>
          <div><label>Дата</label><input type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})} required/></div>
          <div><label>Время</label><input type="time" value={f.time} onChange={e=>setF({...f,time:e.target.value})} required/></div>
          <div><label>Место (текст)</label><input value={f.place} onChange={e=>setF({...f,place:e.target.value})}/></div>
          <div><label>Часовой пояс (часы)</label><input type="number" step="1" min={-14} max={14} value={f.tzOffset} onChange={e=>setF({...f,tzOffset:Number(e.target.value)})}/></div>
          <div><label>Широта</label><input type="number" step="0.0001" min={-90} max={90} value={f.lat} onChange={e=>setF({...f,lat:Number(e.target.value)})}/></div>
          <div><label>Долгота</label><input type="number" step="0.0001" min={-180} max={180} value={f.lon} onChange={e=>setF({...f,lon:Number(e.target.value)})}/></div>
          <div><label>Дома</label><select value={f.houseSystem} onChange={e=>setF({...f,houseSystem:e.target.value as 'P'|'W'})}><option value="P">Placidus</option><option value="W">Whole sign</option></select></div>
          <div style={{gridColumn:'1 / -1', display:'flex', gap:12}}>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Считаю…' : 'Рассчитать'}</button>
            {err && <span style={{color:'#ff6b6b'}}>{err}</span>}
          </div>
        </form>
      </section>

      {chart && (
        <section className="card" style={{gap:12}}>
          <h3 style={{fontSize:20, fontWeight:800}}>Итоги</h3>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8}}>
            <Mini title="Солнце" value={chart.bigThree.Sun}/>
            <Mini title="Луна" value={chart.bigThree.Moon}/>
            <Mini title="Асцендент" value={chart.bigThree.Ascendant}/>
          </div>
          <h4 style={{marginTop:8}}>Планеты</h4>
          <ul style={{lineHeight:1.6}}>
            {chart.planets.map((p: Planet)=>(
              <li key={p.key}>{p.key}: {p.sign}, дом {p.house} — {p.lon.toFixed(2)}°</li>
            ))}
          </ul>
          <h4 style={{marginTop:8}}>Дома</h4>
          <ul style={{lineHeight:1.6}}>
            {chart.houses.cusps.map((c:number,i:number)=>(<li key={i+1}>{i+1} дом: {c.toFixed(2)}°</li>))}
            <li>ASC: {chart.houses.asc.toFixed(2)}°</li>
            <li>MC: {chart.houses.mc.toFixed(2)}°</li>
          </ul>
        </section>
      )}
    </main>
  );
}

function Mini({title,value}:{title:string; value:string}){
  return (
    <div style={{
      borderRadius:14, padding:'10px 12px',
      background:'color-mix(in oklab, var(--bg) 88%, #000)',
      border:'1px solid color-mix(in oklab, var(--bg) 60%, #fff)'
    }}>
      <div style={{fontSize:12, color:'var(--hint)'}}>{title}</div>
      <div style={{fontSize:16, fontWeight:800}}>{value}</div>
    </div>
  );
}