'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChartComputed, ZODIAC_SIGNS_RU, PLANET_SYMBOLS, ASPECT_SYMBOLS, PLANETS_RU } from '@/lib/astro/types'

interface NatalWheelProps {
  chart: ChartComputed
  size?: number
  showAspects?: boolean
  showHouses?: boolean
}

const SIGN_COLORS = [
  '#FF6B6B', // Овен - красный
  '#4ECDC4', // Телец - зеленый
  '#FFE66D', // Близнецы - желтый
  '#95E1D3', // Рак - бирюзовый
  '#FFA500', // Лев - оранжевый
  '#8B7355', // Дева - коричневый
  '#FFB6C1', // Весы - розовый
  '#8B0000', // Скорпион - темно-красный
  '#9370DB', // Стрелец - фиолетовый
  '#696969', // Козерог - серый
  '#4169E1', // Водолей - синий
  '#20B2AA', // Рыбы - морская волна
]

const ASPECT_COLORS = {
  conjunction: '#FFD700',
  opposition: '#FF0000',
  square: '#FF6B6B',
  trine: '#4169E1',
  sextile: '#32CD32',
}

export default function NatalWheel({ 
  chart, 
  size = 600, 
  showAspects = true,
  showHouses = true 
}: NatalWheelProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  
  const center = size / 2
  const outerRadius = size * 0.45
  const innerRadius = size * 0.25
  const planetRadius = size * 0.35
  const houseRadius = size * 0.40
  
  // Calculate planet positions on the wheel
  const planetPositions = useMemo(() => {
    return chart.planets.map(planet => {
      const angle = (planet.longitude - 90) * Math.PI / 180 // Convert to radians and rotate
      const x = center + Math.cos(angle) * planetRadius
      const y = center + Math.sin(angle) * planetRadius
      return { ...planet, x, y, angle: planet.longitude }
    })
  }, [chart.planets, center, planetRadius])
  
  // Filter aspects based on selected planet
  const visibleAspects = useMemo(() => {
    if (!selectedPlanet) return showAspects ? chart.aspects : []
    return chart.aspects.filter(
      aspect => aspect.planet1 === selectedPlanet || aspect.planet2 === selectedPlanet
    )
  }, [chart.aspects, selectedPlanet, showAspects])
  
  // Draw zodiac signs
  const renderZodiacSigns = () => {
    const signs = []
    for (let i = 0; i < 12; i++) {
      const startAngle = i * 30 - 90
      const endAngle = (i + 1) * 30 - 90
      const startRad = startAngle * Math.PI / 180
      const endRad = endAngle * Math.PI / 180
      
      const x1 = center + Math.cos(startRad) * outerRadius
      const y1 = center + Math.sin(startRad) * outerRadius
      const x2 = center + Math.cos(endRad) * outerRadius
      const y2 = center + Math.sin(endRad) * outerRadius
      const x3 = center + Math.cos(endRad) * innerRadius
      const y3 = center + Math.sin(endRad) * innerRadius
      const x4 = center + Math.cos(startRad) * innerRadius
      const y4 = center + Math.sin(startRad) * innerRadius
      
      const path = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`
      
      // Calculate text position
      const midAngle = (startAngle + endAngle) / 2
      const midRad = midAngle * Math.PI / 180
      const textRadius = (outerRadius + innerRadius) / 2
      const textX = center + Math.cos(midRad) * textRadius
      const textY = center + Math.sin(midRad) * textRadius
      
      signs.push(
        <g key={`sign-${i}`}>
          <path
            d={path}
            fill={SIGN_COLORS[i]}
            fillOpacity={0.1}
            stroke={SIGN_COLORS[i]}
            strokeWidth={3}
            strokeOpacity={0.5}
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill={SIGN_COLORS[i]}
            fontWeight="bold"
          >
            {ZODIAC_SIGNS_RU[i].substring(0, 3).toUpperCase()}
          </text>
        </g>
      )
    }
    return signs
  }
  
  // Draw houses
  const renderHouses = () => {
    if (!showHouses) return null
    
    const houses = []
    chart.houses.forEach((house, index) => {
      const angle = (house.cusp - 90) * Math.PI / 180
      const x1 = center + Math.cos(angle) * innerRadius
      const y1 = center + Math.sin(angle) * innerRadius
      const x2 = center + Math.cos(angle) * houseRadius
      const y2 = center + Math.sin(angle) * houseRadius
      
      houses.push(
        <line
          key={`house-${index}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#666"
          strokeWidth={2}
          strokeDasharray={index % 3 === 0 ? '0' : '5,5'}
        />
      )
      
      // Add house number
      const numberAngle = index === 11 
        ? ((house.cusp + chart.houses[0].cusp) / 2 - 90) * Math.PI / 180
        : ((house.cusp + chart.houses[index + 1].cusp) / 2 - 90) * Math.PI / 180
      const numberRadius = innerRadius * 0.8
      const numberX = center + Math.cos(numberAngle) * numberRadius
      const numberY = center + Math.sin(numberAngle) * numberRadius
      
      houses.push(
        <text
          key={`house-num-${index}`}
          x={numberX}
          y={numberY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={10}
          fill="#666"
        >
          {house.number}
        </text>
      )
    })
    
    return houses
  }
  
  // Draw aspects
  const renderAspects = () => {
    return visibleAspects.map((aspect, index) => {
      const planet1 = planetPositions.find(p => p.name === aspect.planet1)
      const planet2 = planetPositions.find(p => p.name === aspect.planet2)
      
      if (!planet1 || !planet2) return null
      
      const color = ASPECT_COLORS[aspect.type]
      const opacity = selectedPlanet ? 0.8 : 0.5
      
      return (
        <motion.line
          key={`aspect-${index}`}
          x1={planet1.x}
          y1={planet1.y}
          x2={planet2.x}
          y2={planet2.y}
          stroke={color}
          strokeWidth={aspect.exact ? 3 : 2}
          strokeOpacity={opacity}
          strokeDasharray={aspect.type === 'sextile' ? '5,5' : '0'}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        />
      )
    })
  }
  
  // Draw planets
  const renderPlanets = () => {
    return planetPositions.map((planet) => {
      const isHighlighted = planet.name === selectedPlanet || planet.name === hoveredPlanet
      const scale = isHighlighted ? 1.2 : 1
      
      return (
        <motion.g
          key={planet.name}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedPlanet(planet.name === selectedPlanet ? null : planet.name)}
          onMouseEnter={() => setHoveredPlanet(planet.name)}
          onMouseLeave={() => setHoveredPlanet(null)}
          style={{ cursor: 'pointer' }}
        >
          <motion.circle
            cx={planet.x}
            cy={planet.y}
            r={15}
            fill="white"
            stroke={planet.retrograde ? '#FF6B6B' : '#4169E1'}
            strokeWidth={2}
            animate={{ scale }}
          />
          <text
            x={planet.x}
            y={planet.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={16}
            fill={planet.retrograde ? '#FF6B6B' : '#333'}
            fontWeight="bold"
            pointerEvents="none"
          >
            {planet.symbol}
          </text>
          {planet.retrograde && (
            <text
              x={planet.x + 10}
              y={planet.y - 10}
              fontSize={8}
              fill="#FF6B6B"
              pointerEvents="none"
            >
              R
            </text>
          )}
        </motion.g>
      )
    })
  }
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="border border-gray-200 rounded-lg bg-white"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="#ddd"
          strokeWidth={1}
        />
        
        {/* Inner circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="#ddd"
          strokeWidth={1}
        />
        
        {/* Zodiac signs */}
        {renderZodiacSigns()}
        
        {/* Houses */}
        {renderHouses()}
        
        {/* Aspects */}
        {renderAspects()}
        
        {/* Planets */}
        {renderPlanets()}
        
        {/* Center point */}
        <circle
          cx={center}
          cy={center}
          r={3}
          fill="#333"
        />
      </svg>
      
      {/* Planet list */}
      <div className="w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Планеты</h3>
        <div className="grid grid-cols-2 gap-2">
          {chart.planets.map(planet => (
            <motion.div
              key={planet.name}
              className={`p-2 rounded-lg border cursor-pointer ${
                selectedPlanet === planet.name 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPlanet(planet.name === selectedPlanet ? null : planet.name)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2">
                <span className="text-xl">{planet.symbol}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {PLANETS_RU[planet.name as keyof typeof PLANETS_RU]}
                    {planet.retrograde && ' ℞'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {planet.sign} {Math.floor(planet.signDegree)}°
                    {planet.house && ` • ${planet.house} дом`}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Aspect preview panel */}
      {selectedPlanet && (
        <motion.div
          className="w-full max-w-md p-4 bg-gray-50 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <h4 className="font-semibold mb-2">
            Аспекты {PLANETS_RU[selectedPlanet as keyof typeof PLANETS_RU]}
          </h4>
          <div className="space-y-1">
            {visibleAspects.map((aspect, index) => {
              const otherPlanet = aspect.planet1 === selectedPlanet ? aspect.planet2 : aspect.planet1
              return (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span style={{ color: ASPECT_COLORS[aspect.type] }}>
                    {ASPECT_SYMBOLS[aspect.type]}
                  </span>
                  <span>{PLANETS_RU[otherPlanet as keyof typeof PLANETS_RU]}</span>
                  <span className="text-gray-500">
                    ({aspect.orb.toFixed(1)}° орб)
                  </span>
                </div>
              )
            })}
            {visibleAspects.length === 0 && (
              <p className="text-gray-500 text-sm">Нет аспектов</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}