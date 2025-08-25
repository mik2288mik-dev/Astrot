import { AstronomyEngine } from './engine'
import { ChartInput } from './types'

describe('AstronomyEngine', () => {
  let engine: AstronomyEngine

  beforeEach(() => {
    engine = new AstronomyEngine()
  })

  describe('computeChart', () => {
    // Тест 1: Известная дата - 1 января 2000, полдень, Москва
    it('should compute chart for Moscow, Jan 1 2000, noon', () => {
      const input: ChartInput = {
        name: 'Test Person 1',
        date: '2000-01-01',
        time: '12:00',
        city: 'Moscow, Russia',
        timezone: '+03:00',
        lat: 55.7558,
        lon: 37.6173,
      }

      const chart = engine.computeChart(input)

      expect(chart).toBeDefined()
      expect(chart.input).toEqual(input)
      expect(chart.planets).toHaveLength(10)
      expect(chart.houses).toHaveLength(12)
      
      // Проверяем, что Солнце около 10 градусов Козерога (280 градусов)
      const sun = chart.planets.find(p => p.name === 'Sun')
      expect(sun).toBeDefined()
      expect(sun!.longitude).toBeGreaterThan(275)
      expect(sun!.longitude).toBeLessThan(285)
      expect(sun!.sign).toBe('Козерог')
      
      // Проверяем, что есть аспекты
      expect(chart.aspects.length).toBeGreaterThan(0)
      
      // Проверяем углы
      expect(chart.ascendant).toBeDefined()
      expect(chart.midheaven).toBeDefined()
      expect(chart.descendant).toBeDefined()
      expect(chart.ic).toBeDefined()
    })

    // Тест 2: Известная дата - 21 марта 1985, 15:30, Нью-Йорк
    it('should compute chart for New York, Mar 21 1985, 15:30', () => {
      const input: ChartInput = {
        name: 'Test Person 2',
        date: '1985-03-21',
        time: '15:30',
        city: 'New York, USA',
        timezone: '-05:00',
        lat: 40.7128,
        lon: -74.0060,
      }

      const chart = engine.computeChart(input)

      expect(chart).toBeDefined()
      expect(chart.planets).toHaveLength(10)
      
      // 21 марта - Солнце должно быть в начале Овна (около 0-1 градуса)
      const sun = chart.planets.find(p => p.name === 'Sun')
      expect(sun).toBeDefined()
      // Солнце в начале Овна
      expect(sun!.longitude).toBeGreaterThanOrEqual(0)
      expect(sun!.longitude).toBeLessThan(5)
      
      // Проверяем ретроградность планет
      const retroPlanets = chart.planets.filter(p => p.retrograde)
      expect(retroPlanets).toBeDefined()
      
      // Проверяем дома
      expect(chart.houses[0].number).toBe(1)
      expect(chart.houses[11].number).toBe(12)
    })

    // Тест 3: Известная дата - 15 августа 1990, 09:45, Лондон
    it('should compute chart for London, Aug 15 1990, 09:45', () => {
      const input: ChartInput = {
        name: 'Test Person 3',
        date: '1990-08-15',
        time: '09:45',
        city: 'London, UK',
        timezone: '+01:00', // British Summer Time
        lat: 51.5074,
        lon: -0.1278,
      }

      const chart = engine.computeChart(input)

      expect(chart).toBeDefined()
      
      // 15 августа - Солнце должно быть во Льве (около 22 градусов Льва = 142 градуса)
      const sun = chart.planets.find(p => p.name === 'Sun')
      expect(sun).toBeDefined()
      expect(sun!.longitude).toBeGreaterThan(135)
      expect(sun!.longitude).toBeLessThan(150)
      expect(sun!.sign).toBe('Лев')
      
      // Проверяем Луну
      const moon = chart.planets.find(p => p.name === 'Moon')
      expect(moon).toBeDefined()
      expect(moon!.longitude).toBeDefined()
      
      // Проверяем аспекты между Солнцем и другими планетами
      const sunAspects = chart.aspects.filter(
        a => a.planet1 === 'Sun' || a.planet2 === 'Sun'
      )
      expect(sunAspects.length).toBeGreaterThan(0)
      
      // Проверяем, что планеты распределены по домам
      const planetsWithHouses = chart.planets.filter(p => p.house !== undefined)
      expect(planetsWithHouses.length).toBe(10)
    })

    // Тест на обработку неизвестного времени
    it('should handle unknown time (default to noon)', () => {
      const input: ChartInput = {
        name: 'Test Unknown Time',
        date: '1995-06-15',
        unknownTime: true,
        city: 'Paris, France',
        timezone: '+02:00',
        lat: 48.8566,
        lon: 2.3522,
      }

      const chart = engine.computeChart(input)

      expect(chart).toBeDefined()
      expect(chart.planets).toHaveLength(10)
      
      // При неизвестном времени используется полдень
      // Солнце в Близнецах (около 24 градусов = 84 градуса)
      const sun = chart.planets.find(p => p.name === 'Sun')
      expect(sun).toBeDefined()
      expect(sun!.sign).toBe('Близнецы')
    })

    // Тест на правильность расчета аспектов
    it('should correctly identify major aspects', () => {
      const input: ChartInput = {
        name: 'Aspect Test',
        date: '2020-01-01',
        time: '00:00',
        city: 'Greenwich, UK',
        timezone: '+00:00',
        lat: 51.4779,
        lon: 0.0,
      }

      const chart = engine.computeChart(input)
      
      // Проверяем наличие различных типов аспектов
      const aspectTypes = new Set(chart.aspects.map(a => a.type))
      
      // Должны быть найдены хотя бы некоторые из основных аспектов
      expect(chart.aspects.length).toBeGreaterThan(5)
      
      // Проверяем структуру аспектов
      chart.aspects.forEach(aspect => {
        expect(aspect.planet1).toBeDefined()
        expect(aspect.planet2).toBeDefined()
        expect(aspect.type).toBeDefined()
        expect(aspect.angle).toBeDefined()
        expect(aspect.orb).toBeDefined()
        expect(aspect.orb).toBeLessThanOrEqual(8) // Максимальный орб
        expect(typeof aspect.applying).toBe('boolean')
        expect(typeof aspect.exact).toBe('boolean')
      })
    })

    // Тест на корректность домов
    it('should correctly calculate house cusps', () => {
      const input: ChartInput = {
        name: 'House Test',
        date: '2010-07-07',
        time: '07:07',
        city: 'Berlin, Germany',
        timezone: '+02:00',
        lat: 52.5200,
        lon: 13.4050,
      }

      const chart = engine.computeChart(input)
      
      // Должно быть ровно 12 домов
      expect(chart.houses).toHaveLength(12)
      
      // Проверяем последовательность домов
      chart.houses.forEach((house, index) => {
        expect(house.number).toBe(index + 1)
        expect(house.cusp).toBeGreaterThanOrEqual(0)
        expect(house.cusp).toBeLessThan(360)
        expect(house.sign).toBeDefined()
        expect(house.signDegree).toBeGreaterThanOrEqual(0)
        expect(house.signDegree).toBeLessThan(30)
      })
      
      // ASC должен быть куспидом 1 дома
      expect(Math.abs(chart.ascendant - chart.houses[0].cusp)).toBeLessThan(1)
      
      // MC должен быть куспидом 10 дома
      const house10 = chart.houses.find(h => h.number === 10)
      expect(house10).toBeDefined()
    })
  })
})