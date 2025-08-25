import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const chartInputSchema = z.object({
  name: z.string().min(1),
  date: z.string(),
  time: z.string().optional(),
  unknownTime: z.boolean().default(false),
  city: z.string(),
  timezone: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const input = chartInputSchema.parse(body)
    
    // Determine timezone from coordinates if not provided
    let timezone = input.timezone
    if (!timezone && input.lat && input.lon) {
      // In production, you would use a proper timezone API
      // For now, we'll use a simple approximation
      const offset = Math.round(input.lon / 15)
      timezone = `UTC${offset >= 0 ? '+' : ''}${offset}`
    }
    
    // Generate a temporary ID for the chart
    const chartId = `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // In production, you would:
    // 1. Calculate the actual chart using Swiss Ephemeris
    // 2. Save to database (Supabase)
    // 3. Return the chart data
    
    // For now, return a mock response
    return NextResponse.json({
      id: chartId,
      input: {
        ...input,
        timezone: timezone || 'UTC',
      },
      computed: {
        // This will be filled with actual chart data
        planets: [],
        houses: [],
        aspects: [],
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error building chart:', error)
    return NextResponse.json(
      { error: 'Failed to build chart' },
      { status: 500 }
    )
  }
}