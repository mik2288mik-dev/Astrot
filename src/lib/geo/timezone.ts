import { find } from 'tz-lookup';
import { DateTime } from 'luxon';

export interface TimezoneInfo {
  timezone: string;
  tzOffset: number;
}

/**
 * Get timezone information for given coordinates
 */
export function getTimezoneInfo(lat: number, lon: number): TimezoneInfo {
  try {
    const timezone = find(lat, lon);
    
    if (!timezone) {
      // Fallback to UTC if timezone not found
      return {
        timezone: 'UTC',
        tzOffset: 0
      };
    }

    // Get current offset for the timezone
    const now = DateTime.now().setZone(timezone);
    const tzOffset = now.offset / 60; // Convert minutes to hours

    return {
      timezone,
      tzOffset
    };
  } catch (error) {
    console.error('Error getting timezone info:', error);
    // Fallback to UTC
    return {
      timezone: 'UTC',
      tzOffset: 0
    };
  }
}

/**
 * Get timezone offset for a specific date and location
 * This accounts for daylight saving time changes
 */
export function getTimezoneOffsetForDate(
  lat: number, 
  lon: number, 
  date: string
): TimezoneInfo {
  try {
    const timezone = find(lat, lon);
    
    if (!timezone) {
      return {
        timezone: 'UTC',
        tzOffset: 0
      };
    }

    // Parse the date and set timezone
    const dateTime = DateTime.fromISO(date).setZone(timezone);
    const tzOffset = dateTime.offset / 60; // Convert minutes to hours

    return {
      timezone,
      tzOffset
    };
  } catch (error) {
    console.error('Error getting timezone offset for date:', error);
    return {
      timezone: 'UTC',
      tzOffset: 0
    };
  }
}