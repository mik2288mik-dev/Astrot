import { getTimezoneInfo } from './timezone';

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

export interface PlaceResult {
  displayName: string;
  lat: number;
  lon: number;
  country: string;
  cityLikeLabel: string;
  timezone: string;
  tzOffset: number;
}

export async function searchPlace(query: string): Promise<PlaceResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DeepSoul/1.0 (https://deepsoul.app)',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const results: NominatimResult[] = await response.json();

    return results.map((result): PlaceResult => {
      const address = result.address;
      const city = address?.city || address?.town || address?.village || address?.municipality;
      const country = address?.country || 'Unknown';
      
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      const timezoneInfo = getTimezoneInfo(lat, lon);
      
      return {
        displayName: result.display_name,
        lat,
        lon,
        country,
        cityLikeLabel: city ? `${city}, ${country}` : country,
        timezone: timezoneInfo.timezone,
        tzOffset: timezoneInfo.tzOffset,
      };
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}