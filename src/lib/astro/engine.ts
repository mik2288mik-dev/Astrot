import * as Astronomy from 'astronomy-engine'
import { 
  ChartInput, 
  ChartComputed, 
  PlanetPosition, 
  HousePosition, 
  Aspect,
  ZODIAC_SIGNS,
  ZODIAC_SIGNS_RU,
  PLANETS,
  PLANET_SYMBOLS,
  ASPECT_ORBS,
  AspectType
} from './types'

// Абстрактный интерфейс для движка эфемерид
export interface EphemerisEngine {
  computeChart(input: ChartInput): ChartComputed
}

// Реализация на базе astronomy-engine
export class AstronomyEngine implements EphemerisEngine {
  
  private dateToJulian(date: string, time?: string): number {
    const [year, month, day] = date.split('-').map(Number)
    let hour = 12, minute = 0
    
    if (time) {
      const [h, m] = time.split(':').map(Number)
      hour = h
      minute = m
    }
    
    const astroTime = new Astronomy.AstroTime(
      new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`)
    )
    
    return astroTime.ut
  }
  
  private getZodiacSign(longitude: number): { sign: string, degree: number } {
    const signIndex = Math.floor(longitude / 30)
    const degree = longitude % 30
    return {
      sign: ZODIAC_SIGNS_RU[signIndex],
      degree
    }
  }
  
  private calculatePlanetPosition(
    body: Astronomy.Body,
    time: Astronomy.AstroTime,
    observer: Astronomy.Observer
  ): PlanetPosition | null {
    try {
      // Get equatorial coordinates
      const equator = Astronomy.Equator(body, time, observer, true, true)
      
      // Convert to ecliptic coordinates
      const ecliptic = Astronomy.Ecliptic(equator.vec, time)
      
      // Calculate retrograde motion
      const timeBefore = time.AddDays(-1)
      const timeAfter = time.AddDays(1)
      const equatorBefore = Astronomy.Equator(body, timeBefore, observer, true, true)
      const equatorAfter = Astronomy.Equator(body, timeAfter, observer, true, true)
      const eclipticBefore = Astronomy.Ecliptic(equatorBefore.vec, timeBefore)
      const eclipticAfter = Astronomy.Ecliptic(equatorAfter.vec, timeAfter)
      
      const speed = (eclipticAfter.elon - eclipticBefore.elon) / 2
      const retrograde = speed < 0
      
      const zodiac = this.getZodiacSign(ecliptic.elon)
      
      return {
        name: body,
        symbol: PLANET_SYMBOLS[body as keyof typeof PLANET_SYMBOLS] || body,
        longitude: ecliptic.elon,
        latitude: ecliptic.elat,
        distance: equator.dist,
        speed,
        retrograde,
        sign: zodiac.sign,
        signDegree: zodiac.degree,
      }
    } catch (error) {
      console.error(`Error calculating position for ${body}:`, error)
      return null
    }
  }
  
  private calculateHouses(
    time: Astronomy.AstroTime,
    latitude: number,
    longitude: number,
    system: 'placidus' | 'whole' = 'placidus'
  ): { houses: HousePosition[], angles: { asc: number, mc: number, desc: number, ic: number } } {
    // Calculate GMST (Greenwich Mean Sidereal Time)
    const gmst = Astronomy.SiderealTime(time)
    
    // Calculate Local Sidereal Time
    const lst = (gmst + longitude / 15) % 24
    const lstDegrees = lst * 15
    
    // Calculate Midheaven (MC)
    const mc = lstDegrees
    
    // Calculate Ascendant
    const obliquity = 23.4397 // Earth's axial tilt
    const ascRadians = Math.atan2(
      Math.cos(lstDegrees * Math.PI / 180),
      -Math.sin(lstDegrees * Math.PI / 180) * Math.cos(obliquity * Math.PI / 180) -
      Math.tan(latitude * Math.PI / 180) * Math.sin(obliquity * Math.PI / 180)
    )
    const asc = (ascRadians * 180 / Math.PI + 360) % 360
    
    // Calculate other angles
    const desc = (asc + 180) % 360
    const ic = (mc + 180) % 360
    
    // Calculate house cusps
    const houses: HousePosition[] = []
    
    if (system === 'whole') {
      // Whole Sign Houses - each house is exactly 30 degrees
      for (let i = 0; i < 12; i++) {
        const cusp = (asc + i * 30) % 360
        const zodiac = this.getZodiacSign(cusp)
        houses.push({
          number: i + 1,
          cusp,
          sign: zodiac.sign,
          signDegree: zodiac.degree
        })
      }
    } else {
      // Simplified Placidus calculation
      // Note: This is a simplified version. Full Placidus requires complex trigonometry
      const houseCusps = [asc]
      
      for (let i = 1; i < 12; i++) {
        if (i === 3) {
          houseCusps.push(ic)
        } else if (i === 6) {
          houseCusps.push(desc)
        } else if (i === 9) {
          houseCusps.push(mc)
        } else {
          // Interpolate other cusps
          const baseAngle = i < 3 ? asc : i < 6 ? ic : i < 9 ? desc : mc
          const offset = (i % 3) * 30
          houseCusps.push((baseAngle + offset) % 360)
        }
      }
      
      houseCusps.forEach((cusp, i) => {
        const zodiac = this.getZodiacSign(cusp)
        houses.push({
          number: i + 1,
          cusp,
          sign: zodiac.sign,
          signDegree: zodiac.degree
        })
      })
    }
    
    return {
      houses,
      angles: { asc, mc, desc, ic }
    }
  }
  
  private calculateAspects(planets: PlanetPosition[]): Aspect[] {
    const aspects: Aspect[] = []
    const aspectTypes: Array<{ type: AspectType, angle: number }> = [
      { type: 'conjunction', angle: 0 },
      { type: 'opposition', angle: 180 },
      { type: 'square', angle: 90 },
      { type: 'trine', angle: 120 },
      { type: 'sextile', angle: 60 },
    ]
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i]
        const planet2 = planets[j]
        
        let angle = Math.abs(planet1.longitude - planet2.longitude)
        if (angle > 180) angle = 360 - angle
        
        for (const aspectType of aspectTypes) {
          const orb = Math.abs(angle - aspectType.angle)
          const maxOrb = ASPECT_ORBS[aspectType.type]
          
          if (orb <= maxOrb) {
            aspects.push({
              planet1: planet1.name,
              planet2: planet2.name,
              type: aspectType.type,
              angle: aspectType.angle,
              orb,
              applying: planet1.speed > planet2.speed,
              exact: orb < 1
            })
            break
          }
        }
      }
    }
    
    return aspects
  }
  
  computeChart(input: ChartInput): ChartComputed {
    // Parse date and time
    const julian = this.dateToJulian(input.date, input.time)
    
    // Create date object with proper timezone handling
    const [year, month, day] = input.date.split('-').map(Number)
    const [hour = 12, minute = 0] = (input.time || '12:00').split(':').map(Number)
    
    // Create UTC date and adjust for timezone
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.000Z`
    const time = Astronomy.MakeTime(new Date(dateStr))
    
    // Create observer at birth location
    const observer = new Astronomy.Observer(input.lat, input.lon, 0)
    
    // Calculate planet positions
    const planets: PlanetPosition[] = []
    const bodies: Astronomy.Body[] = [
      Astronomy.Body.Sun,
      Astronomy.Body.Moon,
      Astronomy.Body.Mercury,
      Astronomy.Body.Venus,
      Astronomy.Body.Mars,
      Astronomy.Body.Jupiter,
      Astronomy.Body.Saturn,
      Astronomy.Body.Uranus,
      Astronomy.Body.Neptune,
      Astronomy.Body.Pluto
    ]
    
    for (const body of bodies) {
      const position = this.calculatePlanetPosition(body, time, observer)
      if (position) {
        planets.push(position)
      }
    }
    
    // Calculate houses and angles
    const { houses, angles } = this.calculateHouses(time, input.lat, input.lon)
    
    // Assign planets to houses
    planets.forEach(planet => {
      for (let i = 0; i < houses.length; i++) {
        const house = houses[i]
        const nextHouse = houses[(i + 1) % 12]
        
        if (house.cusp <= planet.longitude && planet.longitude < nextHouse.cusp) {
          planet.house = house.number
          break
        } else if (house.cusp > nextHouse.cusp) {
          // Handle wrap around 360/0 degrees
          if (planet.longitude >= house.cusp || planet.longitude < nextHouse.cusp) {
            planet.house = house.number
            break
          }
        }
      }
    })
    
    // Calculate aspects
    const aspects = this.calculateAspects(planets)
    
    // Calculate sidereal time
    const sidereal = Astronomy.SiderealTime(time)
    
    return {
      input,
      julian,
      sidereal,
      planets,
      houses,
      aspects,
      ascendant: angles.asc,
      midheaven: angles.mc,
      descendant: angles.desc,
      ic: angles.ic
    }
  }
}

// Фабрика для создания движка
export function createEphemerisEngine(type: 'astronomy' | 'swiss' = 'astronomy'): EphemerisEngine {
  switch (type) {
    case 'astronomy':
      return new AstronomyEngine()
    case 'swiss':
      // В будущем можно добавить SwissEngine
      console.warn('Swiss Ephemeris not available, falling back to astronomy-engine')
      return new AstronomyEngine()
    default:
      return new AstronomyEngine()
  }
}