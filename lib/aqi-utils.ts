/**
 * AQI Utility Functions
 * Handles AQI calculations, categorization, and color mapping
 */

export type AQICategory = 
  | 'good' 
  | 'moderate' 
  | 'unhealthy_sensitive' 
  | 'unhealthy' 
  | 'very_unhealthy' 
  | 'hazardous';

export interface AQICategoryInfo {
  category: AQICategory;
  label: string;
  color: string;
  textColor: string;
  range: { min: number; max: number };
  description: string;
}

export const AQI_CATEGORIES: Record<AQICategory, AQICategoryInfo> = {
  good: {
    category: 'good',
    label: 'Good',
    color: '#00E400',
    textColor: '#000000',
    range: { min: 0, max: 50 },
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
  },
  moderate: {
    category: 'moderate',
    label: 'Moderate',
    color: '#FFFF00',
    textColor: '#000000',
    range: { min: 51, max: 100 },
    description: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
  },
  unhealthy_sensitive: {
    category: 'unhealthy_sensitive',
    label: 'Unhealthy for Sensitive Groups',
    color: '#FF7E00',
    textColor: '#FFFFFF',
    range: { min: 101, max: 150 },
    description: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
  },
  unhealthy: {
    category: 'unhealthy',
    label: 'Unhealthy',
    color: '#FF0000',
    textColor: '#FFFFFF',
    range: { min: 151, max: 200 },
    description: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
  },
  very_unhealthy: {
    category: 'very_unhealthy',
    label: 'Very Unhealthy',
    color: '#8F3F97',
    textColor: '#FFFFFF',
    range: { min: 201, max: 300 },
    description: 'Health alert: The risk of health effects is increased for everyone.',
  },
  hazardous: {
    category: 'hazardous',
    label: 'Hazardous',
    color: '#7E0023',
    textColor: '#FFFFFF',
    range: { min: 301, max: 500 },
    description: 'Health warning of emergency conditions: everyone is more likely to be affected.',
  },
};

/**
 * Get AQI category based on AQI value
 */
export function getAQICategory(aqi: number): AQICategoryInfo {
  if (aqi <= 50) return AQI_CATEGORIES.good;
  if (aqi <= 100) return AQI_CATEGORIES.moderate;
  if (aqi <= 150) return AQI_CATEGORIES.unhealthy_sensitive;
  if (aqi <= 200) return AQI_CATEGORIES.unhealthy;
  if (aqi <= 300) return AQI_CATEGORIES.very_unhealthy;
  return AQI_CATEGORIES.hazardous;
}

/**
 * Get color for AQI value
 */
export function getAQIColor(aqi: number): string {
  return getAQICategory(aqi).color;
}

/**
 * Get text color for AQI value (for contrast)
 */
export function getAQITextColor(aqi: number): string {
  return getAQICategory(aqi).textColor;
}

/**
 * Validate AQI value
 */
export function isValidAQI(aqi: number): boolean {
  return aqi >= 0 && aqi <= 500 && !isNaN(aqi);
}

/**
 * Format AQI value for display
 */
export function formatAQI(aqi: number): string {
  if (!isValidAQI(aqi)) {
    return 'N/A';
  }
  return Math.round(aqi).toString();
}

/**
 * Calculate AQI from pollutant concentration
 * Based on EPA AQI calculation formula
 */
export function calculateAQI(
  concentration: number,
  pollutant: 'PM2.5' | 'PM10' | 'O3' | 'NO2' | 'SO2' | 'CO'
): number {
  // Breakpoint tables for each pollutant
  const breakpoints: Record<string, Array<{ cLow: number; cHigh: number; aqiLow: number; aqiHigh: number }>> = {
    'PM2.5': [
      { cLow: 0.0, cHigh: 12.0, aqiLow: 0, aqiHigh: 50 },
      { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
      { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
      { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
      { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
      { cLow: 250.5, cHigh: 500.4, aqiLow: 301, aqiHigh: 500 },
    ],
    'PM10': [
      { cLow: 0, cHigh: 54, aqiLow: 0, aqiHigh: 50 },
      { cLow: 55, cHigh: 154, aqiLow: 51, aqiHigh: 100 },
      { cLow: 155, cHigh: 254, aqiLow: 101, aqiHigh: 150 },
      { cLow: 255, cHigh: 354, aqiLow: 151, aqiHigh: 200 },
      { cLow: 355, cHigh: 424, aqiLow: 201, aqiHigh: 300 },
      { cLow: 425, cHigh: 604, aqiLow: 301, aqiHigh: 500 },
    ],
  };

  const table = breakpoints[pollutant];
  if (!table) {
    throw new Error(`Unknown pollutant: ${pollutant}`);
  }

  // Find appropriate breakpoint
  const breakpoint = table.find(
    (bp) => concentration >= bp.cLow && concentration <= bp.cHigh
  );

  if (!breakpoint) {
    // If concentration is above highest breakpoint
    return 500;
  }

  // AQI = [(Ihi - Ilo) / (BPhi - BPlo)] * (Cp - BPlo) + Ilo
  const { cLow, cHigh, aqiLow, aqiHigh } = breakpoint;
  const aqi = ((aqiHigh - aqiLow) / (cHigh - cLow)) * (concentration - cLow) + aqiLow;

  return Math.round(aqi);
}

/**
 * Get dominant pollutant from pollutant readings
 */
export function getDominantPollutant(pollutants: {
  pm25?: number;
  pm10?: number;
  o3?: number;
  no2?: number;
  so2?: number;
  co?: number;
}): string {
  const aqiValues = {
    PM25: pollutants.pm25 ? calculateAQI(pollutants.pm25, 'PM2.5') : 0,
    PM10: pollutants.pm10 ? calculateAQI(pollutants.pm10, 'PM10') : 0,
  };

  const maxPollutant = Object.entries(aqiValues).reduce((max, [name, value]) => 
    value > max.value ? { name, value } : max
  , { name: 'PM2.5', value: 0 });

  return maxPollutant.name;
}
